import React from 'react-native';
import { EventEmitter } from 'events';
import assign from 'object-assign';

import AppDispatcher from '../dispatcher/AppDispatcher';
import FollowStore from '../stores/FollowStore';
import HistoryStore from '../stores/HistoryStore';
import SettingStore from '../stores/SettingStore';

const {
    AsyncStorage,
} = React;

const CHANGE_EVENT = 'change';

const APIURL = 'https://nhecuchfn0.execute-api.us-west-2.amazonaws.com/v1';
const HEADERS = {'Accept': 'application/json', 'Content-Type': 'application/json'};
const USER_URL = 'https://s3.amazonaws.com/constellational-users';
const POST_URL = 'https://d2gs3048w5buml.cloudfront.net';

let _posts = null;
let _users = null;
let _requests = null;

function countStarredPosts() {
  if (_posts) {
    let username = SettingStore.getUsername();
    if (_posts[username]) {
      let posts = Object.keys(_posts[username]);
      let starredPosts = posts.filter(post => post.type === 'star');
      return starredPosts.length;
    }
  }
}

function retryFailedRequests() {
  var promiseArr = _requests.map((req) => {
    if (req.stat === 'succeeded') return req;
    else return fetch(req.url, req.params).then(res => res.json()).then((newPost) => {
      if (req.temporaryPostURL) replaceTemporaryPost(req.temporaryPostURL, newPost);
      req.stat = 'succeeded';
      return req;
    }).catch(() => {
      req.stat = 'failed';
      return req;
    });
  });
  Promise.all(promiseArr).then((res) => {
    _requests = res;
  });
}

function loadRequests() {
  return AsyncStorage.getItem('requests').then((str) => {
    if (!str) _requests = [];
    else _requests = JSON.parse(str);
  });
}

function saveRequests() {
  return AsyncStorage.setItem('requests', JSON.stringify(_requests));
}

function addRequest(url, params, temporaryPostURL) {
  var req = {url: url, params: params, temporaryPostURL: temporaryPostURL};
  if (!_requests) loadRequests().then(() => _requests.push(req)).then(saveRequests).then(retryFailedRequests);
  else {
    _requests.push(req);
    saveRequests().then(retryFailedRequests);
  }
}

function loadAsyncStore() {
  return AsyncStorage.getItem('posts').then((str) => {
    if (!str) _posts = {};
    else _posts = JSON.parse(str);
    return AsyncStorage.getItem('users');
  }).then((str) => {
    if (!str) _users = {} 
    else _users = JSON.parse(str);
    PostStore.emitChange();
  }).then(loadRequests);
}

function replaceTemporaryPost(temporaryPostURL, newPost) {
  var username = SettingStore.getUsername();
  delete _posts[username][temporaryPostURL];
  var i = _users[username].posts.indexOf(temporaryPostURL);
  _users[username].posts.splice(i, 1);
  _users[username].posts.unshift(newPost.url);
  _posts[username][newPost.url] = newPost;
  PostStore.emitChange();
  return updateAsyncStore();
}

function createPost(post) {
  var username = SettingStore.getUsername();
  post.created = new Date().toISOString();
  post.updated = post.created;
  if (!post.id) post.id = post.created;
  post.key = post.created;
  post.url = post.key;
  if (!_users[username].posts) _users[username].posts = [];
  _users[username].posts.unshift(post.url);
  _posts[username][post.url] = post;
  PostStore.emitChange();

  var url = APIURL + '/' + username;
  post.token = SettingStore.getToken();
  var params = {method: 'POST', body: JSON.stringify(post), headers: HEADERS};

  addRequest(url, params, post.url);
}
      
function editPost(post) {
  var username = SettingStore.getUsername();
  var i = _users[username].posts.indexOf(post.url);
  _users[username].posts.splice(i, 1);
  _users[username].posts.unshift(post.url);
  _posts[username][post.url] = post;
  PostStore.emitChange();

  var key = post.key;
  if (!key) key = post.created + post.id;
  var url = APIURL + '/' + username + '/' + key;
  post.token = SettingStore.getToken();
  var params = {method: 'PUT', body: JSON.stringify(post), headers: HEADERS};

  addRequest(url, params, post.url);
}

function deletePost(post) {
  var username = SettingStore.getUsername();
  var i = _users[username].posts.indexOf(post.url);
  _users[username].posts.splice(i, 1);
  delete _posts[username][post.url];
  PostStore.emitChange();
 
  var token = SettingStore.getToken();
  var body = JSON.stringify({token: token});
  var key = post.key;
  if (!key) key = post.created + post.id;
  var url = APIURL + '/' + username + '/' + key;
  var params = {method: 'DELETE', body: body, headers: HEADERS};
  
  addRequest(url, params);
}

function fetchUser(username) {
  return fetch(USER_URL + '/' + username).then(res => res.json()).then((user) => {
    _users[username] = user;
    PostStore.emitChange();
  });
}

function fetchPost(username, url) {
  return fetch(POST_URL + '/' + username + '/' + url).then(res => res.json()).then((post) => {
    if (!_posts[username]) _posts[username] = {};
    post.url = url;
    _posts[username][url] = post;
    PostStore.emitChange();
    updateAsyncStore();
  });
}

function fetchAll() {
  let following = FollowStore.getAll();
  let history = HistoryStore.get().map(visit => visit.username);
  let usernames = following.concat(history);
  let promiseArr = usernames.map(fetchUser);
  // Update post list for each user
  return Promise.all(promiseArr).then(() => {
    let promiseArr = usernames.map((username) => {
      let posts = _users[username].posts;
      let promiseArr = posts.map((url) => fetchPost(username, url));
      // Fetch all posts for specific user
      return Promise.all(promiseArr);
    });
    // Fetch all posts for every user
    return Promise.all(promiseArr);
  });
}

function updateAsyncStore() {
  return AsyncStorage.setItem('posts', JSON.stringify(_posts)).then(() => {
    if (_users) return AsyncStorage.setItem('users', JSON.stringify(_users));
  }).catch(err => {
    console.log("couldn't update async store: " + err);
  });
}
   
let PostStore = assign({}, EventEmitter.prototype, {
  getPost: function(username, postURL) {
    if (!username) username = SettingStore.getUsername();
    if (!_posts) {
      loadAsyncStore();
    } else if (!_posts[username] || !_posts[username][postURL]) {
      fetchPost(username, postURL);
    } else {
      let post = _posts[username][postURL];
      post.username = username;
      return post;
    }
  },

  getUser: function(username) {
    if (!username) username = SettingStore.getUsername();
    if (!_users) {
      loadAsyncStore().then(() => fetchUser(username));
      return {posts: []};
    } else if (!_users[username]) {
      fetchUser(username);
      return {posts: []};
    } else {
      return _users[username];
    }
  },

  countStarredPosts: countStarredPosts,

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case 'create-post':
      createPost(action.post);
      break;

    case 'edit-post':
      editPost(action.post);
      break;

    case 'delete-post':
      deletePost(action.post);
      break;

    case 'fetch-user':
      var username = action.username;
      if (!username) username = SettingStore.getUsername();
      fetchUser(username);
      break;

    case 'fetch-all':
      fetchAll().then(updateAsyncStore);
      break;

  }
});

export default PostStore;

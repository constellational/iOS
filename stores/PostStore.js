var APIURL = 'https://1dhhcnzmxi.execute-api.us-east-1.amazonaws.com/v1';
var HEADERS = {'Accept': 'application/json', 'Content-Type': 'application/json'};
var USER_URL = 'https://s3.amazonaws.com/constellational-store';
var POST_URL = 'https://d2nxl7qthm5fu1.cloudfront.net';

var SettingStore = require('../stores/SettingStore');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var React = require('react-native');

var {
    AsyncStorage,
} = React;


var CHANGE_EVENT = 'change';

var _posts = null;
var _users = null;
var _requests = null;

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
  }).then(() => {
    return AsyncStorage.getItem('requests');
  }).then((str) => {
    if (!str) _requests = [];
    else _requests = JSON.parse(str);
  });
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
  return fetch(USER_URL + '/' + username).then(res => res.json());
}

function fetchPost(username, url) {
  return fetch(POST_URL + '/' + username + '/' + url).then(res => res.json()).then((post) => {
    post.url = url;
    return post;
  });
}

function fetchFromServer(username) {
  if (!username) username = SettingStore.getUsername();
  return fetchUser(username).then((user) => {
    _users[username] = user;
    var promiseArr = user.posts.map(url => fetchPost(username, url));
    return Promise.all(promiseArr);
  }).then((posts) => {
    if (!_posts[username]) _posts[username] = {};
    posts.map((post) => {
      _posts[username][post.url] = post;
    });
    PostStore.emitChange();
  });
} 

function updateAsyncStore() {
  return AsyncStorage.setItem('posts', JSON.stringify(_posts)).then(() => {
    if (_users) return AsyncStorage.setItem('users', JSON.stringify(_users));
  }).catch(err => {
    console.log("couldn't update async store: " + err);
  });
}
   
var PostStore = assign({}, EventEmitter.prototype, {
  getAll: function(username) {
    if (!username) username = SettingStore.getUsername();
    if (!_users) {
      loadAsyncStore().then(fetchFromServer).then(updateAsyncStore).then(retryFailedRequests);
      return [];
    } else if (!_users[username]) {
      fetchFromServer(username).then(updateAsyncStore);
      return [];
    } else {
      _users[username].posts = _users[username].posts.filter(url => !!url);
      return _users[username].posts.map(url => _posts[username][url]);
    }
  },

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

  }
});

module.exports = PostStore;

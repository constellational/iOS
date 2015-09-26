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
var _postURLs = null;

function loadAsyncStore() {
  return AsyncStorage.getItem('posts').then(str => {
    _posts = JSON.parse(str);
    return AsyncStorage.getItem('postURLs').then(str => {
      _postURLs = JSON.parse(str);
      PostStore.emitChange();
    });
  });
}

function fetchUser(username) {
  return fetch(USER_URL + '/' + username).then(res => res.json());
}

function fetchPost(username, url) {
  return fetch(POST_URL + '/' + username + '/' + url).then(res => res.json());
}

function fetchFromServer() {
  var username = SettingStore.getUsername();
  return fetchUser(username).then((user) => {
    _postURLs = user.posts;
    return user.posts.map(url => fetchPost(username, url));
  }).then(Promise.all).then((posts) => {
    posts.map((post) => {
      _posts[post.url] = post;
    });
    PostStore.emitChange();
  });
} 

function updateAsyncStore() {
  return AsyncStorage.setItem('posts', JSON.stringify(_posts)).then(() => {
    if (postURLs) return AsyncStorage.setItem('postURLs', JSON.stringify(_postURLs));
  }).catch(err => {
    console.log("couldn't store post: " + err);
  });
}
   
var PostStore = assign({}, EventEmitter.prototype, {
  getAll: function() {
    if (!_postURLs) {
      loadAsyncStore().then(fetchFromServer).then(updateAsyncStore);
      return [];
    } else {
      return _postURLs.map(url => _posts[url]);
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
    case 'create':
      var username = SettingStore.getUsername();
      var url = APIURL + '/' + username;
      action.post.token = SettingStore.getToken();
      console.log(action.post);
      var params = {method: 'POST', body: JSON.stringify(action.post), headers: HEADERS};
      fetch(url, params).then(res => res.json()).then((post) => {
        _postURLs.unshift(post.url);
        _posts[post.url] = post;
        PostStore.emitChange();
        updateAsyncStore();
      });
      break;

    case 'edit':
      var username = SettingStore.getUsername();
      action.post.token = SettingStore.getToken();
      fetch(APIURL + '/' + username, {method: 'PUT', body: JSON.stringify(action.post), HEADERS}).then(post => {
        _posts[post.url] = post;
        PostStore.emitChange();
        updateAsyncStore();
      });
      break;

    case 'delete':
      var username = SettingStore.getUsername();
      var token = SettingStore.getToken();
      var body = JSON.stringify({url: action.url, token: token});
      fetch(APIURL + '/' + username, {method: 'DELETE', body: body, HEADERS}).then(res => {
        var i = _postURLs.indexOf(action.url);
        _postURLs.splice(i, 1);
        delete _posts[action.url];
        PostStore.emitChange();
        updateAsyncStore();
      });
      break;

    case 'saveDraft':
      let post = action.post;
      if (!post.url) post.url = Date.now();
      post.isDraft = true;
      _postURLs.unshift(post.url);
      _posts[post.url] = post;
      PostStore.emitChange();
      updateAsyncStore();
      break;

  }
});

module.exports = PostStore;

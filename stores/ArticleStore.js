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

var _articles = null;
var _articleIDs = null;

function loadAsyncStore() {
  return AsyncStorage.getItem('articles').then(str => {
    _articles = JSON.parse(str);
    return AsyncStorage.getItem('articleIDs').then(str => {
      _articleIDs = JSON.parse(str);
      ArticleStore.emitChange();
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
    _articleIDs = user.posts;
    return user.posts.map(url => fetchPost(username, url));
  }).then(Promise.all).then((posts) => {
    posts.map((post) => {
      _articles[post.id] = post;
    });
    ArticleStore.emitChange();
  });
} 

function updateAsyncStore() {
  return AsyncStorage.setItem('articles', JSON.stringify(_articles)).then(() => {
    if (articleIDs) return AsyncStorage.setItem('articleIDs', JSON.stringify(_articleIDs));
  }).catch(err => {
    console.log("couldn't store article: " + err);
  });
}
   
var ArticleStore = assign({}, EventEmitter.prototype, {
  getAll: function() {
    if (!_articleIDs) {
      loadAsyncStore().then(fetchFromServer).then(updateAsyncStore);
      return [];
    } else {
      return _articleIDs.map(id => _articles[id]);
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
      action.article.token = SettingStore.getToken();
      console.log(action.article);
      var params = {method: 'POST', body: JSON.stringify(action.article), headers: HEADERS};
      fetch(url, params).then(res => res.json()).then((article) => {
        _articleIDs.unshift(article.id);
        _articles[article.id] = article;
        ArticleStore.emitChange();
        updateAsyncStore();
      });
      break;

    case 'edit':
      var username = SettingStore.getUsername();
      action.article.token = SettingStore.getToken();
      fetch(APIURL + '/' + username, {method: 'PUT', body: JSON.stringify(action.article), HEADERS}).then(article => {
        _articles[article.id] = article;
        ArticleStore.emitChange();
        updateAsyncStore();
      });
      break;

    case 'delete':
      var username = SettingStore.getUsername();
      var token = SettingStore.getToken();
      var body = JSON.stringify({id: action.id, token: token});
      fetch(APIURL + '/' + username, {method: 'DELETE', body: body, HEADERS}).then(res => {
        var i = _articleIDs.indexOf(action.id);
        _articleIDs.splice(i, 1);
        delete _articles[action.id];
        ArticleStore.emitChange();
        updateAsyncStore();
      });
      break;

    case 'saveDraft':
      let article = action.article;
      if (!article.id) article.id = Date.now();
      article.isDraft = true;
      _articleIDs.unshift(article.id);
      _articles[article.id] = article;
      ArticleStore.emitChange();
      updateAsyncStore();
      break;

  }
});

module.exports = ArticleStore;

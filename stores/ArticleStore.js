var APIURL = 'https://1dhhcnzmxi.execute-api.us-east-1.amazonaws.com/v1';
var HEADERS = {'Accept': 'application/json', 'Content-Type': 'application/json'};

var SettingStore = require('../stores/SettingStore');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var React = require('react-native');

var {
    AsyncStorage,
} = React;


var CHANGE_EVENT = 'change';

var _articles = {};
var _articleIDs = [];

function load() {
  return AsyncStorage.getItem('articles').then(str => {
    _articles = JSON.parse(str);
    return AsyncStorage.getItem('articleIDs').then(str => {
      _articleIDs = JSON.parse(str);
      ArticleStore.emitChange();
    });
  });
}


var ArticleStore = assign({}, EventEmitter.prototype, {
  getAll: function() {
    if (!_articleIDs) load();
    return _articleIDs.map(id => _articles[id]);
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
      action.article.token = SettingStore.getToken();
      fetch(APIURL + '/' + username, {method: 'POST', body: JSON.stringify(action.article), HEADERS}).then(article => {
        _articleIDs.unshift(article.id);
        _articles[article.id] = article;
        ArticleStore.emitChange();
        AsyncStorage.setItem('articles', JSON.stringify(_articles));
        AsyncStorage.setItem('articleIDs', JSON.stringify(_articleIDs));
      }).catch(err => {
        alert("couldn't store article: " + err);
      });
      break;

    case 'edit':
      var username = SettingStore.getUsername();
      action.article.token = SettingStore.getToken();
      fetch(APIURL + '/' + username, {method: 'PUT', body: JSON.stringify(article), HEADERS}).then(article => {
        _articles[article.id] = article;
        ArticleStore.emitChange();
        AsyncStorage.setItem('articles', JSON.stringify(_articles));
      }).catch(err => {
        alert("couldn't edit article: " + err);
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
        ArticleStoe.emitChange();
        AsyncStorage.setItem('articles', JSON.stringify(_articles));
        AsyncStorage.setItem('articleIDs', JSON.stringify(_articleIDs));
      }).catch(err => {
        alert("Couldn't delete article: " + err);
      });
      break;

    case 'saveDraft':
      let article = action.article;
      if (!article.id) article.id = Date.now();
      article.isDraft = true;
      _articleIDs.unshift(article.id);
      _articles[article.id] = article;
      ArticleStore.emitChange();
      AsyncStorage.setItem('articles', JSON.stringify(_articles));
      AsyncStorage.setItem('articleIDs', JSON.stringify(_articleIDs));
      break;

  }
});

module.exports = ArticleStore;

var APIURL = 'https://1dhhcnzmxi.execute-api.us-east-1.amazonaws.com/v1';
var HEADERS = {'Accept': 'application/json', 'Content-Type': 'application/json'};

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _articles = {};
var _articleIDs = [];

function load() {
  return AsyncStore.getItems('articles').then(str => {
    _articles = JSON.parse(str);
    return AsyncStore.getItems('articleIDs').then(str => {
      _articleIDs = JSON.parse(str);
      ArticleStore.emitChange();
    });
  });
}


var SettingStore = assign({}, EventEmitter.prototype, {
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
      fetch(APIURL + '/' + username, {method: 'POST', body: JSON.stringify(article), HEADERS}).then(article => {
        _articleIDs.unshift(article.id);
        _articles[article.id] = article;
        ArticleStore.emitChange();
        AsyncStore.setItems('articles', JSON.stringify(_articles));
        AsyncStore.setItems('articleIDs', JSON.stringify(_articleIDs));
      }).catch(err => {
        alert("couldn't store article: " + err);
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
        AsyncStore.setItems('articles', JSON.stringify(_articles));
        AsyncStore.setItems('articleIDs', JSON.stringify(_articleIDs));
      }).catch(err => {
        alert("Couldn't delete article: " + err);
      });
      break;
  }
});

module.exports = SettingStore;

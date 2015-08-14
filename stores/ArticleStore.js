var APIURL = 'https://1dhhcnzmxi.execute-api.us-east-1.amazonaws.com/v1';
var STORAGEKEY = 'articles';
var HEADERS = {'Accept': 'application/json', 'Content-Type': 'application/json'};

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _articles = {};
var _articleIDs = [];

var SettingStore = assign({}, EventEmitter.prototype, {
  getAll: function() {
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
        AsyncStore.setItems(STORAGE_KEY, JSON.stringify(articles));
      }).catch(err => {
        alert("couldn't store article: " + err);
      });
      break;

    case 'delete':
      break;
  }
});

module.exports = SettingStore;

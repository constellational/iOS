var APIURL = 'https://1dhhcnzmxi.execute-api.us-east-1.amazonaws.com/v1';
var STORAGEKEY = 'settings';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _settings = {};
var _usernameStatus = '';

function update(settings) {
  _settings = settings;
  SettingStore.emitChange();
}

function updateUsernameStatus(usernameStatus) {
  _usernameStatus = usernameStatus;
  SettingStore.emitChange();
}

var SettingStore = assign({}, EventEmitter.prototype, {
  getToken: function() {
    return _settings.token;
  },

  getUsername: function() {
    return _settings.username;
  },
  
  getUsernameStatus: function() {
    return _usernameStatus;
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
    case 'signup':
      updateUsernameStatus('checking');
      fetch(APIURL + '/' + action.username, {method: 'POST'}).then((meta) => {
        updateUsernameStatus('available');
        update(meta);
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(meta))
      }).catch((err) => {
        updateUsernameStatus('unavailable');
      });
      break;
  }
});

module.exports = SettingStore;

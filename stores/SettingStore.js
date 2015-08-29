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

function load() {
  return AsyncStore.getItems(STORAGE_KEY).then(str => {
    return JSON.parse(str);
  }).then(update);
}

var SettingStore = assign({}, EventEmitter.prototype, {
  getToken: function() {
    if (!_settings) load();
    return _settings.token;
  },

  getUsername: function() {
    if (!_settings) load();
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
      fetch(APIURL + '/' + action.username, {method: 'POST'}).then(res => {
        if (res.status === 403) updateUsernameStatus('unavailable');
        else res.json().then(data => {
          console.log(data);
          updateUsernameStatus('available');
          update(data);
          AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        });
      });
      break;
  }
});

module.exports = SettingStore;

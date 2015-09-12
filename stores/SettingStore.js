var APIURL = 'https://1dhhcnzmxi.execute-api.us-east-1.amazonaws.com/v1';
var HEADERS = {'Accept': 'application/json', 'Content-Type': 'application/json'};
var STORAGE_KEY = 'settings';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var React = require('react-native');

var {
    AsyncStorage,
} = React;

var CHANGE_EVENT = 'change';

var _settings = {};
var _usernameStatus = '';
var _isSignedUp = '';

function update(settings) {
  _settings = settings;
  SettingStore.emitChange();
}

function updateUsernameStatus(usernameStatus) {
  _usernameStatus = usernameStatus;
  SettingStore.emitChange();
}

function load() {
  return AsyncStorage.getItem(STORAGE_KEY).then(str => {
    if (str) _isSignedUp = true;
    else _isSignedUp = false;
    return JSON.parse(str);
  }).then(update);
}

var SettingStore = assign({}, EventEmitter.prototype, {
  loadSettings: function() {
    load();
  },

  getToken: function() {
    return _settings.token;
  },

  getUsername: function() {
    return _settings.username;
  },
  
  getUsernameStatus: function() {
    return _usernameStatus;
  },

  getSignUpStatus: function() {
    return _isSignedUp;
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
      fetch(APIURL, {method: 'POST', body: JSON.stringify({username: action.username}), HEADERS}).then(res => {
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

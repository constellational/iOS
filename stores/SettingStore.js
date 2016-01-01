var APIURL = 'https://nhecuchfn0.execute-api.us-west-2.amazonaws.com/v1';
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
var _emailStatus = '';
var _isSignedUp = '';

function update(settings) {
  _settings = settings;
  SettingStore.emitChange();
  return AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(_settings));
}

function updateUsernameStatus(usernameStatus) {
  _usernameStatus = usernameStatus;
  SettingStore.emitChange();
}

function updateEmailStatus(emailStatus) {
  _emailStatus = emailStatus;
  SettingStore.emitChange();
}

function load() {
  return AsyncStorage.getItem(STORAGE_KEY).then(str => {
    if (str) _isSignedUp = true;
    else _isSignedUp = false;
    _settings = JSON.parse(str);
    SettingStore.emitChange();
  });
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

  getEmailStatus: function() {
    return _emailStatus;
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
      var username = action.username.toLowerCase();
      updateUsernameStatus('checking');
      var body = JSON.stringify({username: username, email: action.email});
      fetch(APIURL, {method: 'POST', body: body, HEADERS}).then(res => {
        if (res.status === 403) updateUsernameStatus('unavailable');
        else res.json().then(data => {
          console.log(data);
          updateUsernameStatus('available');
          update(data);
        });
      });
      break;

    case 'signin':
      var data = {username: action.username.toLowerCase(), email: action.email};
      update(data).then(() => {
        console.log(_settings);
        var body = JSON.stringify(data);
        fetch(APIURL + '/signin', {method: 'POST', body: body, HEADERS}).then((res) => {
          if (res.status !== 200) updateEmailStatus('error');
          else res.json().then(resObj => {
            updateEmailStatus(resObj.status);
          });
        });
      });
      break;

    case 'authenticate':
      load().then(() => {
        console.log(_settings);
        var body = JSON.stringify({username: _settings.username, token: action.token});
        fetch(APIURL + '/tokens', {method: 'POST', body: body, HEADERS}).then((res) => {
          if (res.status === 200) res.json().then(data => {
            console.log(data);
            _settings.token = data.token;
            update(_settings);
          });
        });
      });
      break;
  }
});

module.exports = SettingStore;

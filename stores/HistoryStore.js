var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var React = require('react-native');

var {
    AsyncStorage,
} = React;


var CHANGE_EVENT = 'change';

var _history = null;

function loadAsyncStore() {
  return AsyncStorage.getItem('history').then(str => {
    if (!str) _history = [];
    else _history = JSON.parse(str);
    HistoryStore.emitChange();
  });
}

function updateAsyncStore() {
  return AsyncStorage.setItem('history', JSON.stringify(_history)).catch((err) => {
    console.log("couldn't store history: " + err);
  });
}
   
var HistoryStore = assign({}, EventEmitter.prototype, {
  isEmpty: function() {
    if (_history) return _history.length;
    else return false;
  },

  get: function() {
    if (!_history) {
      loadAsyncStore();
      return [];
    } else {
      return _history;
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
    case 'add-to-history':
      var visit = action.visit;
      visit.timestamp = new Date().toISOString();
      if (!_history) _history = [];
      _history.unshift(visit);
      HistoryStore.emitChange();
      updateAsyncStore();
      break;
  }
});

module.exports = HistoryStore;

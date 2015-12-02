var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var React = require('react-native');
var moment = require('moment');

var {
    AsyncStorage,
} = React;


var CHANGE_EVENT = 'change';
var ASYNC_STORAGE_KEY = 'drafts';

var _drafts = null;
var _draftIDs = null;

function loadAsyncStore() {
  return AsyncStorage.getItem('drafts').then(str => {
    if (!str) _drafts = {};
    else _drafts = JSON.parse(str);
    return AsyncStorage.getItem('draftIDs').then(str => {
      if (!str) _draftIDs  = [];
      else _draftIDs = JSON.parse(str);
      DraftStore.emitChange();
    });
  });
}

function updateAsyncStore() {
  return AsyncStorage.setItem('drafts', JSON.stringify(_drafts)).then(() => {
    if (_draftIDs) return AsyncStorage.setItem('draftIDs', JSON.stringify(_draftIDs));
  }).catch(err => {
    console.log("couldn't store drafts: " + err);
  });
}
   
var DraftStore = assign({}, EventEmitter.prototype, {
  isEmpty: function() {
    return !_drafts;
  },

  getAll: function() {
    if (!_draftIDs) {
      loadAsyncStore();
      return [];
    } else {
      return _draftIDs.map(id => _drafts[id]);
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
    case 'create-draft':
      var draft = action.draft;
      draft.created = new Date().toISOString();
      draft.updated = draft.created;
      draft.id = moment(draft.created).format("YYYYMMDDHHmmss");
      _draftIDs.unshift(draft.id);
      _drafts[draft.id] = draft;
      DraftStore.emitChange();
      updateAsyncStore();
      break;

    case 'edit-draft':
      var draft = action.draft;
      draft.updated = new Date().toISOString();
      _drafts[draft.id] = draft;
      DraftStore.emitChange();
      updateAsyncStore();
      break;

    case 'delete-draft':
      var index = _draftIDs.indexOf(action.draft.id);
      _draftIDs.splice(index, 1);
      delete _drafts[action.draft.id];
      DraftStore.emitChange();
      updateAsyncStore();
      break;

  }
});

module.exports = DraftStore;

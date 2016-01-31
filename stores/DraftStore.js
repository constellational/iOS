import React from 'react-native';
import { EventEmitter } from 'events';
import moment from 'moment';
import assign from 'object-assign';

import AppDispatcher from '../dispatcher/AppDispatcher';

const {
    AsyncStorage,
} = React;

const CHANGE_EVENT = 'change';
const ASYNC_STORAGE_KEY = 'drafts';

let _drafts = null;
let _draftIDs = null;

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
   
let DraftStore = assign({}, EventEmitter.prototype, {
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

export default DraftStore;

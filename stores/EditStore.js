import React from 'react-native';
import { EventEmitter } from 'events';
import moment from 'moment';
import assign from 'object-assign';

import AppDispatcher from '../dispatcher/AppDispatcher';

const {
    AsyncStorage,
} = React;

const CHANGE_EVENT = 'change';

let _edits = null;

function loadAsyncStore() {
  return AsyncStorage.getItem('edits').then(str => {
    if (!str) _edits = {};
    else _edits = JSON.parse(str);
    EditStore.emitChange();
  });
}

function updateAsyncStore() {
  console.log("Going to save");
  console.log(_edits);
  return AsyncStorage.setItem('edits', JSON.stringify(_edits)).catch(err => {
    console.log("couldn't store edited posts: " + err);
  });
}
   
let EditStore = assign({}, EventEmitter.prototype, {
  isEmpty: function() {
    return !_edits;
  },

  getAll: function() {
    if (!_edits) {
      loadAsyncStore();
      return {};
    } else {
      return _edits;
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
    case 'save-edit':
      var post = action.post;
      post.updated = new Date().toISOString();
      _edits[post.id] = post;
      EditStore.emitChange();
      updateAsyncStore();
      break;

    case 'delete-edit':
      delete _edits[action.post.id];
      EditStore.emitChange();
      updateAsyncStore();
      break;

  }
});

export default EditStore;

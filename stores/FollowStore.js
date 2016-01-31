import React from 'react-native';
import { EventEmitter } from 'events';
import moment from 'moment';
import assign from 'object-assign';

import AppDispatcher from '../dispatcher/AppDispatcher';

const {
    AsyncStorage,
} = React;

const CHANGE_EVENT = 'change';
const ASYNC_STORAGE_KEY = 'following';

let _following = null;

function loadAsyncStore() {
  return AsyncStorage.getItem(ASYNC_STORAGE_KEY).then((str) => {
    if (!str) _following = [];
    else _following = JSON.parse(str);
    FollowStore.emitChange();
  });
}

function updateAsyncStore() {
  if (_following) {
    return AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(_following));
  }
}
   
let FollowStore = assign({}, EventEmitter.prototype, {
  isFollowing: function(username) {
    return (_following.indexOf(username) !== -1);
  },

  getAll: function() {
    if (!_following) {
      loadAsyncStore();
      return [];
    } else {
      return _following;
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
    case 'follow':
      _following.push(action.username);
      FollowStore.emitChange();
      updateAsyncStore();
      break;

    case 'unfollow':
      let i = _following.indexOf(action.username);
      _following.splice(i, 1);
      FollowStore.emitChange();
      updateAsyncStore();
      break;

  }
});

export default FollowStore;

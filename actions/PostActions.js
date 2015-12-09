var AppDispatcher = require('../dispatcher/AppDispatcher');

var PostActions = {
  create: function(post) {
    AppDispatcher.dispatch({
      actionType: 'create-post',
      post: post
    });
  },
  
  edit: function(post) {
    AppDispatcher.dispatch({
      actionType: 'edit-post',
      post: post
    });
  },

  del: function(post) {
    AppDispatcher.dispatch({
      actionType: 'delete-post',
      post: post
    });
  },

  fetchUser: function(username) {
    AppDispatcher.dispatch({
      actionType: 'fetch-user',
      username: username
    });
  }

};

module.exports = PostActions;

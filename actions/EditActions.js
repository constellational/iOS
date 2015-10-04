var AppDispatcher = require('../dispatcher/AppDispatcher');

var EditActions = {
  save: function(post) {
    AppDispatcher.dispatch({
      actionType: 'save-edit',
      post: post
    });
  },

  del: function(post) {
    AppDispatcher.dispatch({
      actionType: 'delete-edit',
      post: post
    });
  }

};

module.exports = EditActions;

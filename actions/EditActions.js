import AppDispatcher from '../dispatcher/AppDispatcher';

const EditActions = {
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

export default EditActions;

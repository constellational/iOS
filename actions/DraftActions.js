var AppDispatcher = require('../dispatcher/AppDispatcher');

var DraftActions = {
  create: function(draft) {
    AppDispatcher.dispatch({
      actionType: 'create-draft',
      draft: draft
    });
  },
  
  edit: function(draft) {
    AppDispatcher.dispatch({
      actionType: 'edit-draft',
      draft: draft
    });
  },

  del: function(post) {
    AppDispatcher.dispatch({
      actionType: 'delete-draft',
      draft: draft
    });
  }

};

module.exports = DraftActions;

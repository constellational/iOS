var AppDispatcher = require('../dispatcher/AppDispatcher');

var ArticleActions = {
  create: function(article) {
    AppDispatcher.dispatch({
      actionType: 'create',
      article: article
    });
  },
  
  edit: function(article) {
    AppDispatcher.dispatch({
      actionType: 'edit',
      article: article
    });
  },

  del: function(article) {
    AppDispatcher.dispatch({
      actionType: 'delete',
      article: article
    });
  }

};

module.exports = ArticleActions;

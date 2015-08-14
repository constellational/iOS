var AppDispatcher = require('../dispatcher/AppDispatcher');

var ArticleActions = {
  create: function(article) {
    AppDispatcher.dispatch({
      actionType: 'create',
      article: article
    });
  },
};

module.exports = ArticleActions;

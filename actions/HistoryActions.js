var AppDispatcher = require('../dispatcher/AppDispatcher');

var HistoryActions = {
  add: function(visit) {
    AppDispatcher.dispatch({
      actionType: 'add-to-history',
      visit: visit
    });
  }

};

module.exports = HistoryActions;

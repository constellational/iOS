import AppDispatcher from '../dispatcher/AppDispatcher';

const HistoryActions = {
  add: function(visit) {
    AppDispatcher.dispatch({
      actionType: 'add-to-history',
      visit: visit
    });
  }
};

export default HistoryActions;

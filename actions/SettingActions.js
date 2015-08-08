var AppDispatcher = require('../dispatcher/AppDispatcher');

var SettingActions = {
  signup: function(username) {
    AppDispatcher.dispatch({
      actionType: 'signup',
      username: username
    });
  },
};

module.exports = SettingActions;

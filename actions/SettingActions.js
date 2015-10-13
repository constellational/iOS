var AppDispatcher = require('../dispatcher/AppDispatcher');

var SettingActions = {
  signup: function(username, email) {
    AppDispatcher.dispatch({
      actionType: 'signup',
      username: username,
      email: email
    });
  },
};

module.exports = SettingActions;

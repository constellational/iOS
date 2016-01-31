import AppDispatcher from '../dispatcher/AppDispatcher';

const SettingActions = {
  signup: function(username, email) {
    AppDispatcher.dispatch({
      actionType: 'signup',
      username: username,
      email: email
    });
  },
  
  signin: function(username, email) {
    AppDispatcher.dispatch({
      actionType: 'signin',
      username: username,
      email: email
    });
  },
  
  authenticate: function(token) {
    AppDispatcher.dispatch({
      actionType: 'authenticate',
      token: token
    });
  }
};

export default SettingActions;

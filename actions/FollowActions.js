import AppDispatcher from '../dispatcher/AppDispatcher';

const FollowActions = {
  follow: function(username) {
    AppDispatcher.dispatch({
      actionType: 'follow',
      username: username
    });
  },
 
  unfollow: function(username) {
    AppDispatcher.dispatch({
      actionType: 'unfollow',
      username: username
    });
  }
  
};

export default FollowActions;

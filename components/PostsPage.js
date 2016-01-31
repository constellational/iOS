'use strict'

import React from 'react-native';

import PostActions from '../actions/PostActions';
import HistoryActions from '../actions/HistoryActions';

import DraftStore from '../stores/DraftStore';
import EditStore from '../stores/EditStore';
import PostStore from '../stores/PostStore';
import SettingStore from '../stores/SettingStore';

import BackButton from './BackButton';
import CreateButton from './CreateButton';
import FollowButton from './FollowButton';
import NavBar from './NavBar';
import PostList from './PostList';

const {
  View
} = React;

class PostsPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    if (this.props.username) HistoryActions.add({username: this.props.username, postURL: this.props.postURL, url: this.props.url});
    if (this.props.username && (this.props.username === this.props.currentUser)) {
      this.rightButton = <FollowButton username={this.props.username} />;
    } else {
      this.rightButton = <CreateButton onPress={() => this.props.navigator.push('edit')} />;
    }
    this.backButton = (<BackButton onPress={this.props.navigator.pop} />);
    this.onSettingStoreChange = () => {
      var isSignedUp = SettingStore.getSignUpStatus();
      SettingStore.removeChangeListener(this.onSettingStoreChange);
      if (isSignedUp == false) this.props.navigator.push({id: 'welcome'});
    };
  } 

  componentDidMount() {
    SettingStore.addChangeListener(this.onSettingStoreChange);
  }

  componentWillUnmount() {
    SettingStore.removeChangeListener(this.onSettingStoreChange);
  }
    
  render() {
    var title = 'All Posts';
    if (this.props.filter) title = this.props.filter;
    else if (this.props.username) title = this.props.username;
    return (
      <View>
        <NavBar
          leftButton={this.backButton}
          title={title}
          rightButton={this.rightButton}
        />
        <PostList
          filter={this.props.filter}
          navigator={this.props.navigator}
          postID={this.props.postID}
          postURL={this.props.postURL}
          username={this.props.username}
        />
      </View>
    );
  }
}

export default PostsPage;

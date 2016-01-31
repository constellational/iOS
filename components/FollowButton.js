'use strict';

import React from 'react-native';
import Button from 'react-native-button';
import FollowStore from '../stores/FollowStore'; 
import FollowActions from '../actions/FollowActions';

const {
  StyleSheet
} = React;

const styles = StyleSheet.create({
  button: {
    padding: 8,
    paddingRight: 20,
  }
});

class FollowButton extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onPress = this.onPress.bind(this);
    this.state = {
      isFollowing: FollowStore.isFollowing(this.props.username)
    };
    this.onChange = () => this.setState({
      isFollowing: FollowStore.isFollowing(this.props.username)
    });
  }

  componentDidMount() {
    FollowStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    FollowStore.removeChangeListener(this.onChange);
  }

  onPress() {
    if (this.state.isFollowing) {
      FollowActions.unfollow(this.props.username);
    } else {
      FollowActions.follow(this.props.username);
    }
  }

  render() {
    if (this.props.username === SettingStore.currentUser()) {
      return <Text></Text>;
    } else {
      let text = 'Follow';
      if (this.state.isFollowing) text = 'Unfollow';
      return <Button
        onPress={this.onPress}
        style={styles.button}
        text={text}
      />;
    }
  }
}

export default FollowButton;

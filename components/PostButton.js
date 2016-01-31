'use strict';

import React from 'react-native';
import Button from 'react-native-button';

const {
  StyleSheet,
} = React;

const styles = StyleSheet.create({
  postButton: {
    padding: 8,
    paddingRight: 20,
  },
  disabled: {
    padding: 8,
    paddingRight: 20,
    color: 'grey',
  }
});

class PostButton extends React.Component {
  render() {
    var text = 'Post';
    if (!this.props.isDraft && this.props.edit) text = 'Update';
    return (<Button onPress={this.props.onPress} style={styles.postButton} styleDisabled={styles.disabled} disabled={this.props.disabled}>{text}</Button>);
  }
}

export default PostButton;

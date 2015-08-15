'use strict';

var React = require('react-native');
var Button = require('react-native-button');

var {
  StyleSheet,
} = React;

class PostButton extends React.Component {
  render() {
    return (<Button onPress={this.props.onPress} style={styles.postButton}>Post</Button>);
  }
}

var styles = StyleSheet.create({
  postButton: {
    padding:8,
    paddingRight: 20,
  }
});

module.exports = PostButton;

'use strict';

var React = require('react-native');
var Button = require('react-native-button');

var {
  StyleSheet,
} = React;

class PostButton extends React.Component {
  render() {
    var text = 'Post';
    if (this.props.edit) text = 'Save';
    return (<Button onPress={this.props.onPress} style={styles.postButton}>{text}</Button>);
  }
}

var styles = StyleSheet.create({
  postButton: {
    padding:8,
    paddingRight: 20,
  }
});

module.exports = PostButton;

'use strict'

var PostActions = require('../actions/PostActions');
var React = require('react-native');

var {
  StyleSheet,
  Text,
  View,
  ActionSheetIOS,
} = React;

class Post extends React.Component {
  showOptions() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Edit', 'Delete', 'Cancel'],
      destructiveButtonIndex: 1,
      cancelButtonIndex: 2
    }, (buttonIndex) => {
      if (buttonIndex == 0) this.props.navigator.push({id: 'edit', post: this.props.post});
      else PostActions.del(post);
    });
  }

  render() {
    var post = this.props.post;
    console.log(post);
        //<Text style={styles.heading}>{post.heading}</Text>
    return (
      <View style={styles.post} onLongPress={this.showOptions}>
        <Text style={styles.text}>{post.data}</Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  post: {
    padding: 10,
    marginBottom: 20,
  },
  heading: {
    fontSize: 42,
    padding: 10,
  },
  text: {
    fontSize: 24,
    padding: 8,
  }
});

module.exports = Post;

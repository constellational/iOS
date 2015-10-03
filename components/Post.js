'use strict'

var PostActions = require('../actions/PostActions');
var DraftActions = require('../actions/DraftActions');
var React = require('react-native');

var {
  StyleSheet,
  Text,
  View,
  ActionSheetIOS,
  TouchableOpacity
} = React;

class Post extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.showOptions = this.showOptions.bind(this);
  }

  showOptions() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Edit', 'Delete', 'Cancel'],
      destructiveButtonIndex: 1,
      cancelButtonIndex: 2
    }, (buttonIndex) => {
      if (buttonIndex == 0) this.props.nav.push({id: 'edit', post: this.props.post});
      else if (this.props.post.isDraft) DraftActions.del(this.props.post);
      else PostActions.del(this.props.post);
    });
  }

  render() {
    var draftText = '';
    if (this.props.post.isDraft) draftText = 'Draft';
    return (
      <TouchableOpacity onLongPress={this.showOptions}>
        <View style={styles.post}>
          <Text style={styles.text}>{this.props.post.data}</Text>
          <Text style={styles.draft}>{draftText}</Text>
        </View>
      </TouchableOpacity>
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
  },
  draft: {
    padding: 8,
    color: 'grey'
  }
});

module.exports = Post;

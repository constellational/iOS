'use strict'

var PostActions = require('../actions/PostActions');
var DraftActions = require('../actions/DraftActions');
var React = require('react-native');
var moment = require('moment');

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
    var noteText = '';
    if (this.props.post.isDraft) noteText = 'Draft';
    if (this.props.post.hasUnpublishedEdits) noteText = 'Editing';
    return (
      <TouchableOpacity onLongPress={this.showOptions}>
        <View style={styles.post}>
          <Text style={styles.note}>{noteText}</Text>
          <Text style={styles.text}>{this.props.post.data}</Text>
          <Text style={styles.time}>{moment(this.props.post.updated).format('LLLL')}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

var styles = StyleSheet.create({
  post: {
    padding: 10
  },
  heading: {
    fontSize: 42,
    padding: 10
  },
  text: {
    fontSize: 21,
    padding: 8
  },
  note: {
    fontSize: 14,
    padding: 8,
    color: 'grey',
    alignSelf: 'flex-end'
  },
  time: {
    color: 'grey',
    fontSize: 14,
    padding: 8,
    alignSelf: 'flex-start'
  }
});

module.exports = Post;

'use strict'

var URL = 'https://d1w3fhkxysfgcn.cloudfront.net';

var SettingStore = require('../stores/SettingStore');
var PostActions = require('../actions/PostActions');
var DraftActions = require('../actions/DraftActions');
var React = require('react-native');
var moment = require('moment');

var {
  StyleSheet,
  Text,
  View,
  ActionSheetIOS,
  AlertIOS,
  TouchableOpacity
} = React;

class Post extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.showOptions = this.showOptions.bind(this);
  }

  shareFailure() {
    AlertIOS.alert('Couldn\'t share post');
  }

  shareSuccess(success, method) {
    console.log(success);
    console.log(method);
  }

  showOptions() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Share', 'Edit', 'Delete', 'Cancel'],
      destructiveButtonIndex: 2,
      cancelButtonIndex: 3
    }, (buttonIndex) => {
      var url = URL + '/' + SettingStore.getUsername() + '/' + this.props.post.url;
      if (this.props.post.isDraft || this.props.post.hasUnpublishedEdits) var options = {message: this.props.post.data};
      else var options = {url: url};

      if (buttonIndex === 0) ActionSheetIOS.showShareActionSheetWithOptions(options, this.shareFailure, this.shareSuccess);
      else if (buttonIndex === 1) this.props.nav.push({id: 'edit', post: this.props.post});
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

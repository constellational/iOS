'use strict'

var URL = 'https://d1w3fhkxysfgcn.cloudfront.net';

var SettingStore = require('../stores/SettingStore');
var PostStore = require('../stores/PostStore');
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
    this.handleOptions = this.handleOptions.bind(this);
  }

  shareFailure() {
    AlertIOS.alert('Couldn\'t share post');
  }

  shareSuccess(success, method) {
    console.log(success);
    console.log(method);
  }

  handleOptions(selectedOption) {
    let url = URL + '/' + SettingStore.getUsername() + '/' + this.props.post.id;
    let options = {subject: this.props.post.data.split('\n')[0]};
    if (this.props.post.isDraft || this.props.post.hasUnpublishedEdits) options.message = this.props.post.data;
    else options.url = url;
    if (selectedOption === 'Star') {
      let post = {type: 'star', data: {url: this.props.post.url}};
      PostActions.create(post);
    } else if (selectedOption === 'Remove Star') {
      PostActions.del(this.props.post);
    } else if (selectedOption === 'Share') {
      ActionSheetIOS.showShareActionSheetWithOptions(options, this.shareFailure, this.shareSuccess);
    } else if (selectedOption === 'Edit') {
      this.props.nav.push({id: 'edit', post: this.props.post});
    } else if (selectedOption === 'Delete') {
      if (this.props.post.isDraft) DraftActions.del(this.props.post);
      else PostActions.del(this.props.post);
    }
  }

  showOptions() {
    let username = SettingStore.getUsername();
    let params = {};
    if (username === this.props.post.url.substr(0, username.length)) {
      params = {
        options: ['Share', 'Edit', 'Delete', 'Cancel'],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 3
      };
    } else {
      let options = ['Star', 'Share', 'Cancel'];
      if (this.props.post.type === 'star') options[0] = 'Remove Star';
      params = {
        options: options,
        cancelButtonIndex: 2
      }
    }
    ActionSheetIOS.showActionSheetWithOptions(params, (buttonIndex) => this.handleOptions(params.options[buttonIndex]));
  }

  render() {
    let noteText = '';
    let post = this.props.post;
    if (this.props.post.isDraft) noteText = 'Draft';
    if (this.props.post.hasUnpublishedEdits) noteText = 'Editing';
    if (this.props.post.type === 'star') noteText = 'Starred';
    if (post.type === 'star') {
      noteText = 'Starred';
      let splitURL = post.data.url.split('/');
      let username = splitURL.shift();
      let url = splitURL.join('/');
      post = PostStore.getPost(username, url);
    }
    return (
      <TouchableOpacity onPress={this.showOptions}>
        <View style={styles.post}>
          <Text style={styles.note}>{noteText}</Text>
          <Text style={styles.text}>{post.data}</Text>
          <Text style={styles.time}>{moment(updated).format('LLLL')}</Text>
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
    fontFamily: 'System',
    padding: 10
  },
  text: {
    fontSize: 18,
    fontFamily: 'System',
    padding: 8
  },
  note: {
    fontSize: 14,
    fontFamily: 'System',
    padding: 8,
    color: 'grey',
    alignSelf: 'flex-end'
  },
  time: {
    color: 'grey',
    fontSize: 14,
    fontFamily: 'System',
    padding: 8,
    alignSelf: 'flex-start'
  }
});

module.exports = Post;

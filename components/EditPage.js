'use strict'

var SettingActions = require('../actions/SettingActions');
var SettingStore = require('../stores/SettingStore');
var PostActions = require('../actions/PostActions');
var DraftActions = require('../actions/DraftActions');
var EditActions = require('../actions/EditActions');
var EditStore = require('../stores/EditStore');
var NavBar = require('./NavBar');
var PostButton = require('./PostButton');
var CancelButton = require('./CancelButton');

var React = require('react-native');
var KeyboardEvents = require('react-native-keyboardevents');
var KeyboardEventEmitter = KeyboardEvents.Emitter;

var {
  StyleSheet,
  Text,
  TextInput,
  View,
} = React;

class EditPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    if (!this.props.route.post) {
      this.initialData = '';
      this.state = {post: {data: ''}};
      this.isEditing = false;
    } else {
      this.initialData = this.props.route.post.data;
      this.state = {post: this.props.route.post};
      this.isEditing = true;
    }
    this.saveDraft = this.saveDraft.bind(this);
    this.cancelButton = (<CancelButton onPress={this.saveDraft} />);
    this.savePost = this.savePost.bind(this);
    this.postButton = (<PostButton edit={this.isEditing} isDraft={this.state.post.isDraft} onPress={this.savePost}/>);
    this.updateKeyboardSpace = (frames) => this.setState({height: this.state.height - frames.end.height});
    this.resetKeyboardSpace = () => this.setState({height: this.state.fullHeight});
  }

  componentDidMount() {
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardDidShowEvent, this.updateKeyboardSpace);
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
  }

  componentWillUnmount() {
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardDidShowEvent, this.updateKeyboardSpace);
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
  }

  savePost() {
    if (this.isEditing && this.state.post.isDraft) {
      this.state.post.isDraft = false;
      DraftActions.del(this.state.post);
      PostActions.create(this.state.post);
    } else if (this.isEditing && !this.state.post.isDraft) {
      if (this.state.post.hasUnpublishedEdits) {
        this.state.post.hasUnpublishedEdits = false;
        EditActions.del(this.state.post);
      }
      PostActions.edit(this.state.post);
    } else {
      PostActions.create(this.state.post);
    }
    this.props.navigator.pop();
  }

  saveDraft() {
    if (this.state.post.data !== this.initialData) {
      if (this.state.post.isDraft) {
        DraftActions.edit(this.state.post);
      } else {
        if (this.isEditing) {
          this.state.post.hasUnpublishedEdits = true;
          console.log(this.state.post);
          EditActions.save(this.state.post);
        } else {
          this.state.post.isDraft = true;
          DraftActions.create(this.state.post);
        }
      }
    }
    this.props.navigator.pop();
  }

  render() {
    return (
      <View style={styles.page} onLayout={(ev) => {
        var fullHeight = ev.nativeEvent.layout.height;
        this.setState({height: fullHeight, fullHeight: fullHeight});
      }}>
        <NavBar leftButton={this.cancelButton} rightButton={this.postButton}/>
        <TextInput
          ref='editor'
          multiline={true}
          onChangeText={(text) => {
            this.state.post.data = text;
             if (text) this.setState({leftButton: this.cancelButton});
             else this.setState({leftButton: null});
          }}
          value={this.state.post.data}
          autofocus={true}
          style={[styles.input, {height:this.state.height}]}
        />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'stretch',
  },
  input: {
    padding: 20,
    paddingTop: 10,
    fontSize: 20,
  },
});

module.exports = EditPage;

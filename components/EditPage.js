'use strict'

var SettingActions = require('../actions/SettingActions');
var SettingStore = require('../stores/SettingStore');
var PostActions = require('../actions/PostActions');
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
    var initialPost = this.props.route.post;
    var leftButton = null;
    this.saveDraft = this.saveDraft.bind(this);
    this.cancelButton = (<CancelButton onPress={this.saveDraft} />);
    if (!initialPost) initialPost = {data:''};
    else leftButton = this.cancelButton;
    this.state = {post: initialPost, leftButton: leftButton};
    this.updateKeyboardSpace = (frames) => this.setState({height: this.state.height - frames.end.height});
    this.resetKeyboardSpace = () => this.setState({height: this.state.fullHeight});
    this.savePost = this.savePost.bind(this);
    this.postButton = (<PostButton edit={this.props.post} onPress={this.savePost}/>);
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
    if (this.props.route.post) PostActions.edit(this.state.post);
    else PostActions.create(this.state.post);
    this.props.navigator.pop();
  }

  saveDraft() {
    PostActions.saveDraft(this.state.post);
    this.props.navigator.pop();
  }

  toggleCancelButton() {
    if (this.state.post.data) this.state.leftButton = this.cancelButton;
    else this.state.leftButton = null;
  }

  render() {
    return (
      <View style={styles.page} onLayout={(ev) => {
        var fullHeight = ev.nativeEvent.layout.height;
        this.setState({height: fullHeight, fullHeight: fullHeight});
      }}>
        <NavBar leftButton={this.state.leftButton} rightButton={this.postButton}/>
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

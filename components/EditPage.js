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

var {
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  View,
  DeviceEventEmitter
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
    this.updateKeyboardSpace = (deviceEvent) => {
      var change = deviceEvent..endCoordinates.height;
      this.setState({height: this.state.height - change, isKeyboardUp: true});
    };
    var countWords = () => this.state.post.data.split(/\s+/).filter(w => !!w).length;
    this.resetKeyboardSpace = () => this.setState({height: this.state.fullHeight, isKeyboardUp: false, wordCount: countWords()});
  }

  componentDidMount() {
    DeviceEventEmitter.addListener('keyboardWillShow', this.updateKeyboardSpace);
    DeviceEventEmitter.addListener('keyboardWillHide', this.resetKeyboardSpace);
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeListener('keyboardWillShow', this.updateKeyboardSpace);
    DeviceEventEmitter.removeListener('keyboardWillHide', this.resetKeyboardSpace);
  }

  savePost() {
    if (this.isEditing && this.state.post.isDraft) {
      this.state.post.isDraft = false;
      DraftActions.del(this.state.post);
      delete this.state.post.id;
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
    if (this.state.isKeyboardUp || !this.state.wordCount) var title = <Text></Text>;
    else var title = <Text style={styles.title}>{this.state.wordCount} words</Text>;
    return (
      <View style={styles.page} onLayout={(ev) => {
        // 80 is for the navbar on top
        var fullHeight = ev.nativeEvent.layout.height - 80;
        this.setState({height: fullHeight, fullHeight: fullHeight});
      }}>
        <NavBar leftButton={this.cancelButton} title={title} rightButton={this.postButton}/>
        <ScrollView keyboardDismissMode='interactive'>
          <TextInput
            multiline={true}
            onChangeText={(text) => {
              this.state.post.data = text;
            }}
            defaultValue={this.state.post.data}
            autoFocus={true}
            style={[styles.input, {height:this.state.height}]}
          />
        </ScrollView>
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
    paddingTop: 0,
    fontSize: 18,
    fontFamily: 'System',
  },
  title: {
    paddingTop: 8,
    fontSize: 16,
    fontFamily: 'System',
    color: 'grey',
    textAlign: 'center',
  },
});

module.exports = EditPage;

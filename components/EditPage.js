'use strict'

import React from 'react-native';

import SettingActions from '../actions/SettingActions';
import PostActions from '../actions/PostActions';
import DraftActions from '../actions/DraftActions';
import EditActions from '../actions/EditActions';

import EditStore from '../stores/EditStore';
import SettingStore from '../stores/SettingStore';

import NavBar from './NavBar';
import PostButton from './PostButton';
import CancelButton from './CancelButton';

const {
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  View,
  DeviceEventEmitter
} = React;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'stretch',
  },
  input: {
    padding: 20,
    paddingTop: 0,
    fontSize: 18,
    fontFamily: 'System',
    color: '#4A525A',
  },
  title: {
    paddingTop: 8,
    fontSize: 16,
    fontFamily: 'System',
    color: 'grey',
    textAlign: 'center',
  },
});

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
    this.state.shouldDisablePostButton = true;
    if (this.state.post.isDraft) this.state.shouldDisablePostButton = false;
    this.saveDraft = this.saveDraft.bind(this);
    this.cancelButton = (<CancelButton onPress={this.saveDraft} />);
    this.savePost = this.savePost.bind(this);
    this.updateKeyboardSpace = (deviceEvent) => {
      var change = deviceEvent.endCoordinates.height;
      this.setState({height: this.state.height - change, isKeyboardUp: true});
    };
    var countWords = () => this.state.post.data.split(/\s+/).filter(w => !!w).length;
    this.resetKeyboardSpace = () => this.setState({height: this.state.fullHeight, isKeyboardUp: false, wordCount: countWords()});
  }

  componentDidMount() {
    DeviceEventEmitter.addListener('keyboardWillShow', this.updateKeyboardSpace);
    DeviceEventEmitter.addListener('keyboardWillHide', this.resetKeyboardSpace);
  }

  savePost() {
    if (this.isEditing && this.state.post.isDraft) {
      this.state.post.isDraft = false;
      DraftActions.del(this.state.post);
      delete this.state.post.id;
      PostActions.create(this.state.post);
    } else if (this.state.post.data !== this.initialData) {
      if (this.isEditing && !this.state.post.isDraft) {
        if (this.state.post.hasUnpublishedEdits) {
          this.state.post.hasUnpublishedEdits = false;
          EditActions.del(this.state.post);
        }
        PostActions.edit(this.state.post);
      } else {
        PostActions.create(this.state.post);
      }
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
    var postButton = <PostButton edit={this.isEditing} isDraft={this.state.post.isDraft} onPress={this.savePost} disabled={this.state.shouldDisablePostButton} />;
    if (this.state.isKeyboardUp || !this.state.wordCount) var title = <Text></Text>;
    else var title = <Text style={styles.title}>{this.state.wordCount} words</Text>;
    return (
      <View style={styles.page} onLayout={(ev) => {
        // 80 is for the navbar on top
        var fullHeight = ev.nativeEvent.layout.height - 80;
        this.setState({height: fullHeight, fullHeight: fullHeight});
      }}>
        <NavBar leftButton={this.cancelButton} title={title} rightButton={postButton}/>
        <ScrollView keyboardDismissMode='interactive'>
          <TextInput
            multiline={true}
            onChangeText={(text) => {
              this.state.post.data = text;
              this.setState({shouldDisablePostButton: (!this.state.post.isDraft && (this.state.post.data === this.initialData))});
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

export default EditPage;

'use strict'

var SettingActions = require('../actions/SettingActions');
var SettingStore = require('../stores/SettingStore');
var ArticleActions = require('../actions/ArticleActions');
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
    var initialArticle = this.props.route.article;
    let leftButton = null;
    this.cancelButton = (<CancelButton onPress={this.saveDraft} />);
    if (!initialArticle) initialArticle = {data:''};
    else leftButton = this.cancelButton;
    this.state = {article: initialArticle, leftButton: leftButton};
    this.updateKeyboardSpace = (frames) => this.setState({height: this.state.height - frames.end.height});
    this.resetKeyboardSpace = () => this.setState({height: this.state.fullHeight});
    this.saveArticle = this.saveArticle.bind(this);
    this.saveDraft = this.saveDraft.bind(this);
    this.postButton = (<PostButton edit={this.props.article} onPress={this.saveArticle}/>);
  }

  componentDidMount() {
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardDidShowEvent, this.updateKeyboardSpace);
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
  }

  componentWillUnmount() {
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardDidShowEvent, this.updateKeyboardSpace);
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
  }

  saveArticle() {
    if (this.props.route.article) ArticleActions.edit(this.state.article);
    else ArticleActions.create(this.state.article);
    this.props.navigator.pop();
  }

  saveDraft() {
    ArticleActions.saveDraft(this.state.article);
    this.props.navigator.pop();
  }

  toggleCancelButton() {
    if (this.state.article.data) this.state.leftButton = this.cancelButton;
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
            this.state.article.data = text;
            if (text) this.setState({leftButton: this.cancelButton});
            else this.setState({leftButton: null});
          }}
          value={this.state.article.data}
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

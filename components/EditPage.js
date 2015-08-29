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
    var initialArticle = this.route.article;
    if (!initialArticle) initialArticle = {data:''};
    this.setState({article: initialArticle});
    this.updateKeyboardSpace = (frames) => this.setState({height: this.state.height - frames.end.height});
    this.resetKeyboardSpace = () => this.setState({height: this.state.fullHeight});
    this.saveEntry = this.saveEntry.bind(this);
    this.cancelButton = (<CancelButton onPress={this.props.navigator.pop()} />);
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
    if (this.route.article) ArticleActions.edit(this.state.article);
    else ArticleActions.create(this.state.article);
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    padding: 10,
  },
});

module.exports = EditPage;

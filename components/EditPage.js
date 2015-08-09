'use strict'

var SettingActions = require('../actions/SettingActions');
var SettingStore = require('../store/SettingStore');

var React = require('react-native');
var Viewport = require('react-native-viewport');
var KeyboardEvents = require('react-native-keyboardevents');
var KeyboardEventEmitter = KeyboardEvents.Emitter;

var {
  StyleSheet,
  Text,
  TextInput,
  View,
} = React;

class EditPage extends React.Component {
  constructor() {
    Viewport.getDimensions((dim) => {
      this.state = {height:dim.height};
    });
    this.updateKeyboardSpace = this.updateKeyboardSpace.bind(this);
    this.resetKeyboardSpace = this.resetKeyboardSpace.bind(this);
  }

  updateKeyboardSpace(frames) {
    this.setState({height: this.state.height - frames.end.height});
  }

  resetKeyboardSpace() {
    Viewport.getDimensions((dim) => {
      this.setState({height: dim.height});
    });
  }

  componentDidMount() {
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardDidShowEvent, this.updateKeyboardSpace);
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
  }

  componentWillUnmount() {
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardDidShowEvent, this.updateKeyboardSpace);
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
  }

  render() {
    return (
      <View style={styles.page}>
        <TextInput
          ref='editor'
          multiline={true}
          value={this.props.value}
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

module.exports = SettingsPage;

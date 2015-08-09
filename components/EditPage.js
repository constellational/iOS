'use strict'

var SettingActions = require('../actions/SettingActions');
var SettingStore = require('../store/SettingStore');
var Viewport = require('react-native-viewport');
var React = require('react-native');

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

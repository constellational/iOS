'use strict'

var SettingActions = require('../actions/SettingActions');
var React = require('react-native');

var {
  StyleSheet,
  Text,
  TextInput,
  View,
} = React;

class SettingsPage extends React.Component {
  constructor() {
    var title = 'Settings';
    var instructions = 'Change your username';
    if (!this.props.username) {
      var title = 'Welcome!';
      var instructions = 'Pick a username';
    }
    this.state = {
      heading = title;
      subheading = instructions;
    };
  } 

  render() {
    if (this.props.username) var returnKeyType = 'done';
    else var returnKeyType = 'join';
    return (
      <View style={styles.page}>
        <Text style={styles.heading}>{this.state.heading}</Text>
        <Text style={styles.subheading}>{this.state.subheading}</Text>
        <TextInput
          ref='username'
          keyboardType='url'
          returnKeyType={returnKeyType}
          value={this.props.username}
          autofocus={true}
          style={styles.input}
          placeholder='username' 
          onSubmitEditing={(event) => {
            this.setState({heading: 'Signing you up', subheading: 'Checking your username'});
            SettingActions.signup(event.nativeEvent.text);
            // how do you catch errors in flux?
            // if things go well
            // this.setState({heading: 'Yay!', subheading: 'Let\'s get you started'});
            // navigator magic
            // else
            // this.setState({heading: 'Oops!', subheading: 'That username\'s been taken'});
          }}
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
  heading: {
    fontSize: 42,
    padding: 10,
  },
  subheading: {
    fontSize: 24,
    padding: 8,
  },
  input: {
    alignSelf: 'center',
    margin: 10,
    marginBottom: 120,
    height: 46,
    width: 150,
    textAlign: 'center',
    borderWidth: 0.5,
    borderColor: 'black',
    borderRadius: 5,
  },
});

module.exports = SettingsPage;

'use strict'

var React = require('react-native');

var {
  StyleSheet,
  Text,
  TextInput,
  View,
} = React;

class SettingsPage extends React.Component {
  render() {
    if (this.props.username) {
      var title = 'Settings';
      var instructions = 'Change your username';
      var returnKeyType = 'done';
    } else {
      var title = 'Welcome!';
      var instructions = 'Pick a username';
      var returnKeyType = 'join';
    }
    return (
      <View style={styles.page}>
        <Text style={styles.heading}>{title}</Text>
        <Text style={styles.subheading}>{instructions}</Text>
        <TextInput 
          keyboardType='url'
          returnKeyType={returnKeyType}
          value={this.props.username}
          autofocus={true}
          style={styles.input}
          placeholder='username' 
          onSubmitEditing={(event) => {
            // this.props.route.data.title = event.nativeEvent.text;
            // LogActions.edit(this.props.route);
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

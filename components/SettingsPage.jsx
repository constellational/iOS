'use strict'

var React = require('react-native');

var {
  StyleSheet,
  Text,
  TextInput,
  View,
} = React;

class SettingsPage extends React.component {
  render() {
    var title = 'Settings';
    var instructions = 'Pick a username';
    if (this.props.username) instructions = 'Change your username';
    else title = 'Welcome!';
    return (
      <View style={styles.page}>
        <Text style={styles.heading}>{title}</Text>
        <Text style={styles.subheading}>{instructions}</Text>
        <TextInput 
          returnKeyType='done'
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
});

module.exports = SettingsPage;

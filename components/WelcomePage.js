'use strict'

var SettingActions = require('../actions/SettingActions');
var SettingStore = require('../stores/SettingStore');
var React = require('react-native');

var Heading = require('./Heading');
var Subheading = require('./Subheading');

var {
  StyleSheet,
  Text,
  TextInput,
  View,
} = React;

class WelcomePage extends React.Component {
  constructor(props, context) {
    super(props);
    var title = 'Welcome!';
    var instructions = 'Pick a username';
    this.state = {
      heading: title,
      subheading: instructions,
    };
    this.onChange = this.onChange.bind(this);
    this.getStarted = this.getStarted.bind(this);
  } 

  componentDidMount() {
    SettingStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    SettingStore.removeChangeListener(this.onChange);
  }

  getStarted() {
    this.props.navigator.replace({id: 'articles'});
    this.props.navigator.push({id: 'edit'});
  }

  onChange() {
    var usernameStatus = SettingStore.getUsernameStatus();
    if (usernameStatus === 'unavailable') {
      this.setState({heading: 'Try another username', subheading: 'This one seems to be taken!'});
    } else if (usernameStatus === 'available') {
      this.setState({heading: 'Yay! You\'re all set', subheading: 'Time to write something', success: true});
    }
  }

  renderNextButton() {
    if (this.state.success) {
      return (<Text 
        style={[styles.textBox, {padding: 12, fontSize: 18}]} 
        onPress={this.getStarted}>
          Get Started
        </Text>);
    } 
  }

  renderUsernameField() {
    if (!this.state.success) {
      return (
        <TextInput
          ref='username'
          keyboardType='url'
          returnKeyType='join'
          autofocus={true}
          style={styles.textBox}
          placeholder='username' 
          onSubmitEditing={(event) => {
            this.setState({heading: 'Signing you up', subheading: 'Checking your username'});
            SettingActions.signup(event.nativeEvent.text);
          }}
        />
      );
    }
  }

  render() {
    return (
      <View style={styles.page}>
        <Heading text={this.state.heading} />
        <Subheading text={this.state.subheading} />
        {this.renderNextButton()}
        {this.renderUsernameField()}
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
  textBox: {
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

module.exports = WelcomePage;

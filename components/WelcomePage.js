'use strict'

var URL = 'https://d1w3fhkxysfgcn.cloudfront.net';

var SettingActions = require('../actions/SettingActions');
var SettingStore = require('../stores/SettingStore');
var React = require('react-native');

var Heading = require('./Heading');
var Subheading = require('./Subheading');
var BigButton = require('./BigButton');

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
    this.signup = this.signup.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getStarted = this.getStarted.bind(this);
    this.renderBottomSection = this.renderBottomSection.bind(this);
  } 

  componentDidMount() {
    SettingStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    SettingStore.removeChangeListener(this.onChange);
  }

  getStarted() {
    this.props.navigator.immediatelyResetRouteStack([{id: 'posts'}, {id: 'edit'}]);
  }

  checkUsername() {
    return fetch(URL + '/' + this.state.username).then((res) => {
      if (res.status === 404) {
        this.setState({
          isUsernameAvailable: true,
          subheading: "What's your email address?"
        });
      }
      else {
        this.setState({
          isUsernameAvailable: false,
          heading: 'Try another username', 
          subheading: 'This one seems to be taken!'
        });
      }
    });
  }

  signup() {
    this.setState({heading: 'Signing you up'});
    SettingActions.signup(this.state.username, this.state.email);
  }

  onChange() {
    var usernameStatus = SettingStore.getUsernameStatus();
    if (usernameStatus === 'unavailable') {
      this.setState({heading: 'Try another username', subheading: 'This one seems to be taken!'});
    } else if (usernameStatus === 'available') {
      this.setState({heading: 'Yay! You\'re all set', subheading: 'Time to write something', success: true});
    }
  }

  renderBottomSection() {
    if (this.state.success) {
      return(<BigButton onPress={this.getStarted} text={'Get Started'} />);
    } else if (this.state.username && this.state.isUsernameAvailable) {
      return (<TextInput
        key='email'
        keyboardType='email-address'
        returnKeyType='join'
        style={styles.textBox}
        placeholder='email address'
        autoFocus={true}
        onSubmitEditing={(event) => {
          this.setState({email: event.nativeEvent.text});
          this.signup();
        }}
      />);
    } else {
      return (<TextInput
        key='username'
        keyboardType='url'
        returnKeyType='next'
        autoFocus={true}
        style={styles.textBox}
        placeholder='username' 
        onSubmitEditing={(event) => {
          this.setState({username: event.nativeEvent.text, subheading: 'Checking your username'});
          this.checkUsername();
        }}
      />);
    }
  }

  render() {
    return (
      <View style={styles.page}>
        <Heading text={this.state.heading} />
        <Subheading text={this.state.subheading} />
        <View style={styles.bottomSection}>
          {this.renderBottomSection()}
        </View>
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
    height: 46,
    width: 150,
    textAlign: 'center',
    borderWidth: 0.5,
    borderColor: 'black',
    borderRadius: 5,
  },
  bottomSection: {
    marginBottom: 120,
  },
});

module.exports = WelcomePage;

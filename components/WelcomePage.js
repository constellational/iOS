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
    this.props.navigator.immediatelyResetRouteStack([{id: 'posts'}, {id: 'edit'}]);
  }

  checkUsername() {
    return fetch(URL + '/' + this.state.username).then((res) => {
      if (res.status === 404) {
        this.setState({isUsernameAvailable: true});
        Promise.resolve();
      }
      else Promise.reject();
    }).catch(() => {
      this.setState({heading: 'Try another username', subheading: 'This one seems to be taken!'});
    });
  }

  signup() {
    if (this.state.username && this.state.email && this.state.isUsernameAvailable) {
      this.setState({heading: 'Signing you up'});
      SettingActions.signup(this.state.username, this.state.email);
    }
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
    var usernameReturnKeyType = 'next';
    if (this.state.success) return(<BigButton onPress={this.getStarted} text={'Get Started'} />);
    if (this.state.email) usernameReturnKeyType = 'join';
    else return (
      <View>
        <TextInput
          ref='username'
          keyboardType='url'
          returnKeyType={usernameReturnKeyType}
          autoFocus={true}
          style={styles.textBox}
          placeholder='username' 
          onSubmitEditing={(event) => {
            this.setState({username: event.nativeEvent.text, subheading: 'Checking your username'});
            this.checkUsername().then(this.signup);
          }}
        />
        <TextInput
          ref='email'
          keyboardType='email-address'
          returnKeyType='join'
          style={styles.textBox}
          placeholder='email address'
          onSubmitEditing={(event) => {
            this.setState({email: event.nativeEvent.text});
            this.checkUsername().then(this.signup);
          }}
        />
      </View>
    );
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

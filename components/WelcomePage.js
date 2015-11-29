'use strict'

var SettingActions = require('../actions/SettingActions');
var SettingStore = require('../stores/SettingStore');
var React = require('react-native');

var Heading = require('./Heading');
var Subheading = require('./Subheading');
var BodyText = require('./BodyText');
var BigButton = require('./BigButton');

var {
  StyleSheet,
  Text,
  TextInput,
  View,
  LinkingIOS,
} = React;

class WelcomePage extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      heading: 'Constellational',
      subheading: 'Welcome!'
    };
    var url = LinkingIOS.popInitialURL();
    if (url) this.handleOpenURL({url});
    this.signup = this.signup.bind(this);
    this.onSettingStoreChange = this.onSettingStoreChange.bind(this);
    this.handleOpenURL = this.handleOpenURL.bind(this);
    this.getStarted = this.getStarted.bind(this);
    this.renderBottomSection = this.renderBottomSection.bind(this);
  } 

  componentDidMount() {
    SettingStore.addChangeListener(this.onSettingStoreChange);
    LinkingIOS.addEventListener('url', this.handleOpenURL);
  }

  componentWillUnmount() {
    SettingStore.removeChangeListener(this.onSettingStoreChange);
    LinkingIOS.removeEventListener('url', this.handleOpenURL);
  }

  getStarted() {
    this.props.navigator.immediatelyResetRouteStack([{id: 'posts'}, {id: 'edit'}]);
  }

  handleOpenURL(event) {
    var uriComponent = event.url.split('token=')[1];
    var token = JSON.parse(decodeURIComponent(uriComponent));
    console.log(token);
    this.setState({heading: 'Welcome Back!', subheading: 'Signing you in'});
    SettingActions.authenticate(token);
  }

  checkUsername(username) {
    var username = username.toLowerCase();
    this.setState({username: username});
    var url = 'constellational.com/' + username;
    return fetch(url).then((res) => {
      console.log(this.state.username);
      console.log(url);
      console.log(res.status);
      if (res.status !== 404) {
        this.setState({
          isUsernameAvailable: false,
          heading: 'Try another username', 
          subheading: 'This one\'s taken!'
        });
      } else {
        this.setState({
          isUsernameAvailable: true,
          heading: 'Almost Done!',
          subheading: 'What\'s your email address?'
        });
      }
    });
  }

  signup(email) {
    this.setState({heading: 'Signing you up'});
    SettingActions.signup(this.state.username, email);
  }

  signin(email) {
    this.setState({heading: 'Sending you a signin email', subheading: 'Please click the link in the email to sign in'});
    SettingActions.signin(this.state.username, email);
  }

  onSettingStoreChange() {
    if (this.state.isSigningUp) {
      var usernameStatus = SettingStore.getUsernameStatus();
      if (usernameStatus === 'unavailable') {
        this.setState({username: '', heading: 'Try another username', subheading: 'This one\'s taken!'});
      } else if (usernameStatus === 'available') {
        this.setState({heading: 'Yay! All set', subheading: 'Time to write something', success: true});
      }
    } else {
      var token = SettingStore.getToken();
      if (token) this.props.navigator.immediatelyResetRouteStack([{id: 'posts'}]);
    }
  }

  renderBottomSection() {
    if (this.state.success) {
      return(<BigButton onPress={this.getStarted} text={'Get Started'} />);
    } else if (this.state.username && (this.state.isSigningIn || this.state.isUsernameAvailable)) {
      var returnKeyType = 'join';
      if (this.state.isSigningIn) returnKeyType = 'done';
      return (<TextInput
        key='email'
        keyboardType='email-address'
        returnKeyType={returnKeyType}
        autoCapitalize='none'
        autoCorrect={false}
        style={styles.textBox}
        placeholder='email address'
        autoFocus={true}
        onSubmitEditing={(event) => {
          var e = event.nativeEvent.text;
          if (this.state.isSigningUp) this.signup(e);
          else this.signin(e);
        }}
      />);
    } else if (this.state.isSigningIn || this.state.isSigningUp) {
      return (<TextInput
        key='username'
        keyboardType='url'
        returnKeyType='next'
        autoFocus={true}
        style={styles.textBox}
        placeholder='username' 
        autoCapitalize='none'
        autoCorrect={false}
        onSubmitEditing={(event) => {
          this.setState({username: event.nativeEvent.text});
          if (this.state.isSigningUp) {
            this.setState({subheading: 'Checking your username'});
            this.checkUsername(event.nativeEvent.text);
          } else {
            this.setState({subheading: 'What\'s your email address?'});
          }
        }}
      />);
    } else {
      var signupState = {isSigningUp: true, heading: 'Welcome!', subheading: 'Pick a username'};
      var signinState = {isSigningIn: true, heading: 'Welcome Back!', subheading: "What's your username?"};
      return (<View>
        <BigButton onPress={() => this.setState(signupState)} text={'Sign up'} />
        <BodyText onPress={() => this.setState(signinState)} text={'Already Signed Up?'} />
      </View>);
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
    fontSize: 18,
    fontFamily: 'System',
    fontWeight: '200',
    alignSelf: 'center',
    margin: 10,
    height: 46,
    width: 200,
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

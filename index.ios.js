'use strict';

var React = require('react-native');

var SettingStore = require('./stores/SettingStore');
var WelcomePage = require('./components/WelcomePage');
var EditPage = require('./components/EditPage');
var ArticlesPage = require('./components/ArticlesPage');

var {
  AppRegistry,
  Navigator
} = React;

class Constellational extends React.Component {
  componentDidMount() {
    SettingStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    SettingStore.removeChangeListener(this.onChange);
  }

  onChange() {
    var isSignedUp = SettingStore.getSignUpStatus();
    if (isSignedUp) this.props.navigator.push({id: 'articles'});
    else this.props.navigator.push({id: 'welcome'});
  }

  renderScene(route, nav) {
    switch (route.id) {
      case 'welcome':
        return <WelcomePage navigator={nav} />;
      case 'articles':
        return <ArticlesPage navigator={nav} />;
      default:
        return <EditPage route={route} navigator={nav} />;
    }
  }

  render() {
    return (<Navigator
      initialRoute={{id: 'articles'}}
      renderScene={this.renderScene}
      configureScene={() => Navigator.SceneConfigs.FloatFromRight}
    />);
  }
}

AppRegistry.registerComponent('Constellational', () => Constellational);

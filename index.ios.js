'use strict';
var STORAGE_KEY = 'settings';

var React = require('react-native');
var SettingStore = require('./stores/SettingStore');
var WelcomePage = require('./components/WelcomePage');
var EditPage = require('./components/EditPage');
var ArticlesPage = require('./components/ArticlesPage');

var {
  AsyncStorage,
  AppRegistry,
  Navigator
} = React;

class Constellational extends React.Component {
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
    SettingStore.loadSettings();
    return (<Navigator
      initialRoute={{id: 'articles'}}
      renderScene={this.renderScene}
      configureScene={() => Navigator.SceneConfigs.FloatFromRight}
    />);
  }
}

AppRegistry.registerComponent('Constellational', () => Constellational);

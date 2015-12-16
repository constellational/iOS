'use strict';

var React = require('react-native');
var SettingStore = require('./stores/SettingStore');
var WelcomePage = require('./components/WelcomePage');
var NavPage = require('./components/NavPage');
var EditPage = require('./components/EditPage');
var PostsPage = require('./components/PostsPage');

var {
  AppRegistry,
  Navigator
} = React;

class Constellational extends React.Component {
  renderScene(route, nav) {
    switch (route.id) {
      case 'welcome':
        return <WelcomePage navigator={nav} />;
      case 'navigation':
        return <NavPage navigator={nav} />;
      case 'posts':
        return <PostsPage
          navigator={nav}
          filter={route.filter}
          username={route.username}
          postID={route.postID}
          postURL={route.postURL}/>;
      default:
        return <EditPage route={route} navigator={nav} />;
    }
  }

  render() {
    SettingStore.loadSettings();
    return (<Navigator
      initialRoute={{id: 'welcome'}}
      renderScene={this.renderScene}
      configureScene={() => Navigator.SceneConfigs.FloatFromRight}
    />);
  }
}

AppRegistry.registerComponent('Constellational', () => Constellational);

'use strict';

var React = require('react-native');

var WelcomePage = require('./components/WelcomePage');
var EditPage = require('./components/EditPage');
var ArticlesPage = require('./components/ArticlesPage');

var {
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
    return (<Navigator
      initialRoute={{id: 'welcome'}}
      renderScene={this.renderScene}
      configureScene={() => Navigator.SceneConfigs.FloatFromRight}
    />);
  }
}

AppRegistry.registerComponent('Constellational', () => Constellational);

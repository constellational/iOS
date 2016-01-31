'use strict';

import React from 'react-native';

import PostActions from './actions/PostActions';
import SettingStore from './stores/SettingStore';

import EditPage from './components/EditPage';
import NavPage from './components/NavPage';
import PostsPage from './components/PostsPage';
import WelcomePage from './components/WelcomePage';

const {
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
          url={route.url}
          username={route.username}
          postID={route.postID}
          postURL={route.postURL}/>;
      default:
        return <EditPage route={route} navigator={nav} />;
    }
  }

  render() {
    SettingStore.loadSettings();
    PostActions.fetchAll();
    return (<Navigator
      initialRoute={{id: 'welcome'}}
      renderScene={this.renderScene}
      configureScene={() => Navigator.SceneConfigs.FloatFromRight}
    />);
  }
}

AppRegistry.registerComponent('Constellational', () => Constellational);

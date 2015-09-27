'use strict'

var PostActions = require('../actions/PostActions');
var PostStore = require('../stores/PostStore');
var SettingStore = require('../stores/SettingStore');
var NavBar = require('./NavBar');
var CreateButton = require('./CreateButton');
var Post = require('./Post');
var React = require('react-native');

var {
  ListView,
  StyleSheet,
  Text,
  View,
} = React;

class PostsPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.createButton = (<CreateButton onPress={() => this.props.navigator.push('edit')}/>);
    this.state = {
      posts: dataSource.cloneWithRows(PostStore.getAll())
    };
    this.onChange = this.onChange.bind(this);
    this.onSettingStoreChange = () => {
      var isSignedUp = SettingStore.getSignUpStatus();
      SettingStore.removeChangeListener(this.onSettingStoreChange);
      if (isSignedUp == false) this.props.navigator.push({id: 'welcome'});
    };
  } 

  componentDidMount() {
    SettingStore.addChangeListener(this.onSettingStoreChange);
    PostStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    SettingStore.removeChangeListener(this.onSettingStoreChange);
    PostStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState({
      posts: this.state.posts.cloneWithRows(PostStore.getAll())
    });
  }

  render() {
    return (
      <View style={styles.page}>
        <NavBar rightButton={this.createButton}/>
        <ListView
          automaticallyAdjustContentInsets={false}
          dataSource={this.state.posts}
          renderRow={post => (<Post post={post} nav={this.props.navigator}/>)}
          style={styles.list}
        />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  list: {
  },
});

module.exports = PostsPage;

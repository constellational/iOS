'use strict'

var PostStore = require('../stores/PostStore');
var DraftStore = require('../stores/DraftStore');
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
    this.getAll = this.getAll.bind(this);
    this.state = {
      posts: dataSource.cloneWithRows(this.getAll())
    };
    this.onChange = () => {
      this.setState({
        posts: dataSource.cloneWithRows(this.getAll())
      });
    };
    this.onSettingStoreChange = () => {
      var isSignedUp = SettingStore.getSignUpStatus();
      SettingStore.removeChangeListener(this.onSettingStoreChange);
      if (isSignedUp == false) this.props.navigator.push({id: 'welcome'});
    };
  } 

  componentDidMount() {
    SettingStore.addChangeListener(this.onSettingStoreChange);
    PostStore.addChangeListener(this.onChange);
    DraftStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    SettingStore.removeChangeListener(this.onSettingStoreChange);
    PostStore.removeChangeListener(this.onChange);
    DraftStore.removeChangeListener(this.onChange);
  }

  getAll() {
    var posts = PostStore.getAll();
    var drafts = DraftStore.getAll();
    var all = posts.concat(drafts);
    var sorted = all.sort((a, b) => {
      if (a.updated > b.updated) return -1;
      else if (a.updated < b.updated) return 1;
      else return 0;
    });
    return sorted;
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

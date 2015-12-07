'use strict'

var PostStore = require('../stores/PostStore');
var DraftStore = require('../stores/DraftStore');
var EditStore = require('../stores/EditStore');
var SettingStore = require('../stores/SettingStore');
var HistoryActions = require('../actions/HistoryActions');
var NavBar = require('./NavBar');
var CreateButton = require('./CreateButton');
var BackButton = require('./BackButton');
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
    if (this.props.username) HistoryActions.add({username: this.props.username, postURL: this.props.postURL});
    var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.createButton = (<CreateButton onPress={() => this.props.navigator.push('edit')}/>);
    this.backButton = (<BackButton onPress={this.props.navigator.pop} />);
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
    EditStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    SettingStore.removeChangeListener(this.onSettingStoreChange);
    PostStore.removeChangeListener(this.onChange);
    DraftStore.removeChangeListener(this.onChange);
    EditStore.removeChangeListener(this.onChange);
  }

  getAll() {
    var user = PostStore.getUser(this.props.username);
    var posts = user.posts.map(url => PostStore.getPost(this.props.username, url));
    var edits = EditStore.getAll();
    posts = posts.map((post) => {
      if (edits[post.id]) return edits[post.id];
      else return post;
    });
    var drafts = DraftStore.getAll();
    var all = posts.concat(drafts);
    var filtered = all;
    if (this.props.filter === 'Currently Editing') filtered = all.filter(post => post.hasUnpublishedEdits);
    else if (this.props.filter === 'Drafts') filtered = all.filter(post => post.isDraft);
    var sorted = filtered.sort((a, b) => {
      if (a.updated > b.updated) return -1;
      else if (a.updated < b.updated) return 1;
      else return 0;
    });
    return sorted;
  }

  render() {
    var title = 'All Posts';
    if (this.props.filter) title = this.props.filter;
    return (
      <View style={styles.page}>
        <NavBar leftButton={this.backButton} title={title} rightButton={this.createButton}/>
        <ListView
          automaticallyAdjustContentInsets={false}
          dataSource={this.state.posts}
          renderRow={post => (<Post post={post} nav={this.props.navigator} key={post.id}/>)}
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

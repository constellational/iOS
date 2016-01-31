'use strict'
import FollowButton from './FollowButton';
var PostStore = require('../stores/PostStore');
var PostActions = require('../actions/PostActions');
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
    if (this.props.username) HistoryActions.add({username: this.props.username, postURL: this.props.postURL, url: this.props.url});
    let dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    if (this.props.username && (this.props.username === this.props.currentUser)) {
      this.rightButton = <FollowButton username={this.props.username} />;
    } else {
      this.rightButton = <CreateButton onPress={() => this.props.navigator.push('edit')} />;
    }
    this.backButton = (<BackButton onPress={this.props.navigator.pop} />);
    this.getPosts = this.getPosts.bind(this);
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

  movePostToTop(postURL, postID, posts) {
    if (!postURL) {
      // Find the postURL that contains the postID
      posts.forEach((url) => {
        if (url.indexOf(props.postID) > -1) postURL = url;
      });
    }
    // Move it to be displayed on top
    posts.splice(user.posts.indexOf(postURL), 1);
    return posts.unshift(postURL);
  }

  getDrafts() {
    return DraftStore.getAll();
  }

  getEdits() {
    let edits = EditStore.getAll();
    return Object.keys(edits).map(id => edits[id]);
  }

  getPosts() {
    var user = PostStore.getUser(this.props.username);
    let posts = user.posts;
    if (!posts) {
      return [];
    } else {
      if (this.props.postURL || this.props.postID) {
        posts = movePostToTop(this.props.postURL, this.props.postID, posts);
      }
      posts = posts.map(url => PostStore.getPost(this.props.username, url));
      return posts.filter(post => !!post);
    }
  }

  getStarredPosts() {
    let posts = this.getPosts();
    return posts.filter(post => post.type === 'star');
  }

  sortPosts(posts) {
    let sorted = posts.sort((a, b) => {
      if (a.updated > b.updated) return -1;
      else if (a.updated < b.updated) return 1;
      else return 0;
    });
    return sorted;
  }

  getAll() {
    if (this.props.username) return this.getPosts(this.props.username);
    else if (this.props.filter === 'Drafts') return this.getDrafts();
    else if (this.props.filter === 'Currently Editing') return this.getEdits();
    else if (this.props.filter === 'Starred Posts') return this.getStarredPosts();
    else {
      let posts = this.getPosts();
      let edits = EditStore.getAll();
      posts = posts.map((post) => {
        if (edits[post.id]) return edits[post.id];
        else return post;
      });
      let drafts = DraftStore.getAll();
      let all = posts.concat(drafts);
      return this.sortPosts(all);
    }
  }

  render() {
    var title = 'All Posts';
    if (this.props.filter) title = this.props.filter;
    else if (this.props.username) title = this.props.username;
    return (
      <View style={styles.page}>
        <NavBar leftButton={this.backButton} title={title} rightButton={this.rightButton}/>
        <ListView
          automaticallyAdjustContentInsets={false}
          dataSource={this.state.posts}
          renderRow={post => <Post post={post} nav={this.props.navigator} key={post.id}/>}
          onRefreshStart={(endRefreshing) => {
            PostActions.fetchUser(this.props.username);
            endRefreshing();
          }}
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

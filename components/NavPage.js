'use strict'

var PostStore = require('../stores/PostStore');
var DraftStore = require('../stores/DraftStore');
var EditStore = require('../stores/EditStore');
var HistoryStore = require('../stores/HistoryStore');
var NavBar = require('./NavBar');
var React = require('react-native');

var {
  ListView,
  StyleSheet,
  Text,
  View,
  LinkingIOS,
} = React;

class NavPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.handleOpenURL = this.handleOpenURL.bind(this);
    var url = LinkingIOS.popInitialURL();
    if (url) this.handleOpenURL({url});
    this.getAll = this.getAll.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.state = {
      options: dataSource.cloneWithRows(this.getAll())
    };
    this.onChange = () => {
      this.setState({
        options: dataSource.cloneWithRows(this.getAll())
      });
    };
  } 

  componentDidMount() {
    PostStore.addChangeListener(this.onChange);
    DraftStore.addChangeListener(this.onChange);
    EditStore.addChangeListener(this.onChange);
    HistoryStore.addChangeListener(this.onChange);
    LinkingIOS.addEventListener('url', this.handleOpenURL);
  }

  componentWillUnmount() {
    PostStore.removeChangeListener(this.onChange);
    DraftStore.removeChangeListener(this.onChange);
    EditStore.removeChangeListener(this.onChange);
    HistoryStore.removeChangeListener(this.onChange);
    LinkingIOS.removeEventListener('url', this.handleOpenURL);
  }

  handleOpenURL(event) {
    var urlPath = event.url.split('constellational.com/')[1];
    var splitPath = urlPath.split('/');
    var username = splitPath.shift();
    var postID = splitPath.shift();
    this.props.navigator.immediatelyResetRouteStack([
      {id: 'navigation'},
      {id: 'posts', username: username, postID: postID, url: urlPath}
    ]);
  }

  getAll() {
    var list = ['All Posts'];
    if (!EditStore.isEmpty()) list.push('Currently Editing');
    if (!DraftStore.isEmpty()) list.push('Drafts');
    list.push('Help');
    var history = HistoryStore.get().map((visit) => {
      if (visit.postURL) {
        var post = PostStore.getPost(visit.username, visit.postURL);
        post.username = visit.username;
        return post;
      } else {
        return visit;
      }
    });
    list = list.concat(history);
    return list;
  }

  render() {
    return (
      <View style={styles.page}>
        <NavBar leftButton={this.backButton} title='Constellational' rightButton={this.createButton}/>
        <ListView
          automaticallyAdjustContentInsets={false}
          dataSource={this.state.options}
          renderRow={this.renderRow}
        />
      </View>
    );
  }

  renderRow(row) {
    if (typeof row === 'string') {
      let onPress = () => this.props.navigator.push({id: 'posts', filter: row});
      return <View style={styles.option}>
        <Text onPress={onPress} style={styles.text}>{row}</Text>
      </View>;
    } else {
      console.log(row);
      let route = {
        id: 'posts',
        username: row.username,
        postURL: row.url,
        url: row.username
      };
      if (row.id) route.url = row.username + '/' + row.id;
      console.log(route);
      let onPress = () => this.props.navigator.push(route);
      let text = row.username;
      if (row.data) text = row.data.split('\n')[0];
      return <View style={styles.option}>
        <Text onPress={onPress} style={styles.text}>{text}</Text>
      </View>;
    }
  }
}

var styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  option: {
    padding: 10
  },
  text: {
    fontSize: 18,
    fontFamily: 'System',
    padding: 8
  },
 
});

module.exports = NavPage;

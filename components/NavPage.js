'use strict'

var PostStore = require('../stores/PostStore');
var DraftStore = require('../stores/DraftStore');
var EditStore = require('../stores/EditStore');
var NavBar = require('./NavBar');
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
  }

  componentWillUnmount() {
    PostStore.removeChangeListener(this.onChange);
    DraftStore.removeChangeListener(this.onChange);
    EditStore.removeChangeListener(this.onChange);
  }

  getAll() {
    var list = ['All Posts'];
    if (!EditStore.isEmpty()) list.push('Currently Editing');
    if (!DraftStore.isEmpty()) list.push('Drafts');
    list.push('Help');
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

  renderRow(filter) {
    var onPress = () => this.props.navigator.push({id: 'posts', filter: filter});
    return <Text onPress={onPress} style={styles.text}>{filter}</Text>;
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

module.exports = PostsPage;

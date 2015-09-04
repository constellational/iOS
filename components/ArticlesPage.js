'use strict'

var ArticleActions = require('../actions/ArticleActions');
var ArticleStore = require('../stores/ArticleStore');
var NavBar = require('./NavBar');
var CreateButton = require('./CreateButton');
var Article = require('./Article');
var React = require('react-native');

var {
  ListView,
  StyleSheet,
  Text,
  View,
} = React;

class ArticlesPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.createButton = (<CreateButton onPress={() => this.props.navigator.push('edit')}/>);
    this.state = {
      articles: dataSource.cloneWithRows(ArticleStore.getAll())
    };
  } 

  componentDidMount() {
    ArticleStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    ArticleStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState({
      articles: this.state.articles.cloneWithRows(ArticleStore.getAll())
    });
  }

  render() {
    return (
      <View style={styles.page}>
        <NavBar rightButton={this.createButton}/>
        <ListView
          automaticallyAdjustContentInsets={false}
          dataSource={this.state.articles}
          renderRow={article => (<Article article={article} />)}
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

module.exports = ArticlesPage;

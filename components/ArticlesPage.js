'use strict'

var ArticleActions = require('../actions/ArticleActions');
var ArticleStore = require('../stores/ArticleStore');
var React = require('react-native');

var {
  StyleSheet,
  Text,
  View,
} = React;

class ArticlesPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      articles: dataSource.cloneWithRows(ArticleStore.getAll());
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
      <ListView
        automaticallyAdjustContentInsets={false}
        dataSource={this.state.articles}
        renderRow={article => (<Article article={article} />)}
        style={styles.list}
      />
    );
  }
}

var styles = StyleSheet.create({
  list: {
  },
});

module.exports = SettingsPage;

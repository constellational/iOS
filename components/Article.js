'use strict'

var ArticleActions = require('../actions/ArticleActions');
var React = require('react-native');

var {
  StyleSheet,
  Text,
  View,
  ActionSheetIOS,
} = React;

class Article extends React.Component {
  showOptions() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Edit', 'Delete', 'Cancel'],
      destructiveButtonIndex: 1,
      cancelButtonIndex: 2
    }, (buttonIndex) => {
      if (buttonIndex == 0) this.props.navigator.push({id: 'edit', article: this.props.article});
      else ArticleActions.del(article);
    });
  }

  render() {
    var article = this.props.article;
    console.log(article);
        //<Text style={styles.heading}>{article.heading}</Text>
    return (
      <View style={styles.article} onLongPress={this.showOptions}>
        <Text style={styles.text}>{article.data}</Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  article: {
    padding: 10,
    marginBottom: 20,
  },
  heading: {
    fontSize: 42,
    padding: 10,
  },
  text: {
    fontSize: 24,
    padding: 8,
  }
});

module.exports = Article;

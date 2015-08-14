'use strict'

var React = require('react-native');

var {
  StyleSheet,
  Text,
  View,
} = React;

class Article extends React.Component {
  render() {
    var article = this.props.article;
    return (
      <View style={styles.article}>
        <Text style={styles.heading}>{article.heading}</Text>
        <Text style={styles.body}>{article.text}</Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
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

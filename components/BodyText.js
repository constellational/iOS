'use strict'

var React = require('react-native');

var {
  StyleSheet,
  Text,
} = React;

class BodyText extends React.Component {
  render() {
    return (<Text style={styles.bodyText} allowFontScaling={true} onPress={this.props.onPress}>{this.props.text}</Text>);
  }
}

var styles = StyleSheet.create({
  bodyText: {
    fontSize: 18,
    fontFamily: 'System',
    fontWeight: '200',
    padding: 10,
  }
});

module.exports = BodyText;

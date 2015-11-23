'use strict'

var React = require('react-native');

var {
  StyleSheet,
  Text,
} = React;

class Subheading extends React.Component {
  render() {
    return (<Text style={styles.subheading} allowFontScaling={true} onPress={this.props.onPress}>{this.props.text}</Text>);
  }
}

var styles = StyleSheet.create({
  subheading: {
    fontSize: 24,
    fontFamily: 'System',
    fontWeight: '200',
    padding: 10,
  }
});

module.exports = Subheading;

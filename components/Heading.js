'use strict'

var React = require('react-native');

var {
  StyleSheet,
  Text,
} = React;

class Heading extends React.Component {
  render() {
    return (<Text style={styles.heading} allowFontScaling={true} onPress={this.props.onPress}>{this.props.text}</Text>);
  }
}

var styles = StyleSheet.create({
  heading: {
    fontSize: 42,
    fontFamily: 'System',
    fontWeight: '100',
    padding: 10,
    color: '#4A525A',
  }
});

module.exports = Heading;

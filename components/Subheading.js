'use strict'

var React = require('react-native');

var {
  StyleSheet,
  Text,
} = React;

class Subheading extends React.Component {
  render() {
    return (<Text style={styles.subheading} allowFontScaling={true}>{this.props.text}</Text>);
  }
}

var styles = StyleSheet.create({
  subheading: {
    font: -apple-system-subheadline1,
    padding: 10,
  }
});

module.exports = Subheading;

'use strict'

import React from 'react-native';

const {
  StyleSheet,
  Text
} = React;

let styles = StyleSheet.create({
  bodyText: {
    fontSize: 18,
    fontFamily: 'System',
    fontWeight: '200',
    padding: 10,
    color: '#4A525A',
  }
});

class BodyText extends React.Component {
  render() {
    return (<Text style={styles.bodyText} allowFontScaling={true} onPress={this.props.onPress}>{this.props.text}</Text>);
  }
}

export default BodyText;

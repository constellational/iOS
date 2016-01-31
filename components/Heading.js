'use strict'

import React from 'react-native';

const {
  StyleSheet,
  Text,
} = React;

const styles = StyleSheet.create({
  heading: {
    fontSize: 42,
    fontFamily: 'System',
    fontWeight: '100',
    padding: 10,
    color: '#4A525A',
  }
});

class Heading extends React.Component {
  render() {
    return (<Text
      style={styles.heading}
      allowFontScaling={true}
      onPress={this.props.onPress}>
      {this.props.text}
    </Text>);
  }
}

export default Heading;

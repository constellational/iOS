'use strict'

import React from 'react-native';

const {
  StyleSheet,
  Text,
} = React;

const styles = StyleSheet.create({
  subheading: {
    fontSize: 24,
    fontFamily: 'System',
    fontWeight: '200',
    padding: 10,
    color: '#4A525A',
  }
});

class Subheading extends React.Component {
  render() {
    return (<Text
      style={styles.subheading}
      allowFontScaling={true}
      onPress={this.props.onPress}>
      {this.props.text}
    </Text>);
  }
}

export default Subheading;

'use strict'

import React from 'react-native';

const {
  StyleSheet,
  Text,
} = React;

let styles = StyleSheet.create({
  bigButton: {
    fontSize: 18,
    fontFamily: 'System',
    fontWeight: '200',
    alignSelf: 'center',
    margin: 10,
    height: 46,
    width: 150,
    textAlign: 'center',
    borderWidth: 0.5,
    borderColor: '#4A525A',
    borderRadius: 5,
    padding: 12,
    color: '#4A525A',
  }
});

class BigButton extends React.Component {
  render() {
    return (<Text 
      allowFontScaling={true}
      style={styles.bigButton} 
      onPress={this.props.onPress}>
        {this.props.text}
      </Text>);
  }
}

export default BigButton;

'use strict'

var React = require('react-native');

var {
  StyleSheet,
  Text,
} = React;

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

var styles = StyleSheet.create({
  bigButton: {
    fontSize: 18,
    fontWeight: '200',
    alignSelf: 'center',
    margin: 10,
    height: 46,
    width: 150,
    textAlign: 'center',
    borderWidth: 0.5,
    borderColor: 'black',
    borderRadius: 5,
    padding: 12,
  }
});

module.exports = BigButton;

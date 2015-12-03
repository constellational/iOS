'use strict';

var React = require('react-native');
var {Icon, } = require('react-native-icons');

var {
  StyleSheet,
  View,
  TouchableOpacity,
} = React;

class BackButton extends React.Component {
  render() {
    return (
      <TouchableOpacity 
        onPress={this.props.onPress}> 
        <View> 
          <Icon
            name='ion|ios-arrow-left'
            size={32}
            style={styles.navBarLeftButton}
          />
        </View> 
      </TouchableOpacity> 
    ); 
  }
}

var styles = StyleSheet.create({
  navBarLeftButton: {
    marginTop: 3,
    marginLeft: 10,
    width: 32,
    height: 32,
  },
});

module.exports = BackButton;

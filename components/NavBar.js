'use strict';

var React = require('react-native');

var {
  StyleSheet,
  Text,
  View,
} = React;

class NavBar extends React.Component {
  render() {
    return (
      <View style={styles.navBar}>
        <View style={styles.left}>
          {this.props.leftButton}
        </View>
        <View style={styles.center}>
          {this.props.title}
        </View>
        <View style={styles.right}>
          {this.props.rightButton}
        </View>
      </View>
    );
  }
}
        
var styles = StyleSheet.create({
  navBar: {
    paddingTop:30,
    paddingBottom:5,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  center: {
    flex: 1,
  },

});

module.exports = NavBar;

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
          <Text style={styles.title}>{this.props.title}</Text>
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
    backgroundColor: 'white',
  },
  left: {
    flex: 1,
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    paddingTop: 6,
    fontSize: 18,
    fontFamily: 'System',
    textAlign: 'center',
  },
});

module.exports = NavBar;

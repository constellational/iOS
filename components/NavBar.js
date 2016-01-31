'use strict';

import React from 'react-native';

const {
  StyleSheet,
  Text,
  View,
} = React;

const styles = StyleSheet.create({
  navBar: {
    paddingTop:30,
    paddingBottom:5,
    backgroundColor: 'white',
    flexDirection: 'row',
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
    color: '#4A525A',
  },
});

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

export default NavBar;

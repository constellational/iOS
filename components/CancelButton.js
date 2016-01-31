'use strict';

import React from 'react-native';
import { Icon } from 'react-native-icons';

const {
  StyleSheet,
  View,
  TouchableOpacity,
} = React;

const styles = StyleSheet.create({
  navBarLeftButton: {
    marginTop: 3,
    marginLeft: 10,
    width: 32,
    height: 32,
  },
});


class CancelButton extends React.Component {
  render() {
    return (
      <TouchableOpacity 
        onPress={this.props.onPress}> 
        <View> 
          <Icon
            name='ion|ios-close-empty'
            size={32}
            style={styles.navBarLeftButton}
          />
        </View> 
      </TouchableOpacity> 
    ); 
  }
}

export default CancelButton;

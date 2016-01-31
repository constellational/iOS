'use strict';

import React from 'react-native';
import { Icon } from 'react-native-icons';

const {
  StyleSheet,
  View,
  TouchableOpacity
} = React;

const styles = StyleSheet.create({
  navBarRightButton: {
    marginRight: 10,
    width: 32,
    height: 32,
  },
});

class CreateButton extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View> 
          <Icon
            name='ion|ios-plus-outline'
            size={32}
            style={styles.navBarRightButton}
          />
        </View> 
      </TouchableOpacity> 
    );
  }
}

export default CreateButton;

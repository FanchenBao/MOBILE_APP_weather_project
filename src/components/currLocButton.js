import React, {Component} from 'react';
import {Text, TouchableHighlight, StyleSheet} from 'react-native';

class CurrLocButton extends Component {
  _onPress = () => console.log('currLoButton pressed');

  render() {
    return (
      <TouchableHighlight
        style={styles.touchable}
        underlayColor={'#cccccc'}
        onPress={this._onPress}>
        <Text style={styles.buttonText}>Use Current Location</Text>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  touchable: {
    flex: 0.5,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 100,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
  },
});

export {CurrLocButton};

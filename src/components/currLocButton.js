import React, {Component} from 'react';
import {Text, TouchableHighlight, StyleSheet} from 'react-native';
import {getGeolocation} from '../functions/geolocation.js';

class CurrLocButton extends Component {
  constructor(props) {
    super(props);
    this.coord = null;
  }

  _onPress = async () => {
    this.props.setToWait(); // force display android progress bar
    try {
      await getGeolocation(position => {
        setTimeout(() => console.log(position), 1000); // force wait 1s
        this.props.onPressCB({
          type: 'coord',
          value: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

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
    marginVertical: 5,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
  },
});

export {CurrLocButton};

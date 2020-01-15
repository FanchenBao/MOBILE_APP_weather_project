import React, {PureComponent} from 'react';
import {Text, TouchableHighlight, StyleSheet} from 'react-native';
import {getGeolocation} from '../functions/geolocation.js';

/**
 * A class for "Use Current Location" button.
 *
 * Upon button press, the app first acquires current location (if possible),
 * then obtain the weather info by querying the location coordinates.
 *
 * This button is disabled if there is no internet.
 */
class CurrLocButton extends PureComponent {
  constructor(props) {
    super(props);
    this.coord = null;
  }

  /**
   * Callback when getGeolocation executes successfully.
   *
   * It calls setStateForecast(), which is defined in weather_project.js to
   * pass the query object to fetch weather info.
   *
   * @param {Map} position: Geolocation acquired from the device.
   */
  _successCallback = position => {
    setTimeout(() => console.log(position), 100); // force wait
    this.props.setStateForecast({
      type: 'coord',
      value: {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      },
    });
  };

  /**
   * Callback when getGeolocation encounters error during location retrieval.
   *
   * It also calls setStateForecast() to pass along error message for display.
   *
   * @param {Map} error: Error while getting geolocation.
   */
  _errorCallback = error => {
    console.error(error.code, error.message);
    this.props.setStateForecast({
      type: 'error',
      value: 'Obtain current location failed',
    });
  };

  /**
   * Callback when location permission is not granted by user.
   *
   * It also calls setStateForecast(), to pass along error message for display.
   *
   */
  _denyCallback = () => {
    this.props.setStateForecast({
      type: 'error',
      value: 'Obtain current location NOT allowed',
    });
  };

  /** Callback when current location button is pressed */
  _onPress = async () => {
    this.props.setToWait(); // display android progress bar
    try {
      await getGeolocation(
        this._successCallback,
        this._errorCallback,
        this._denyCallback,
      );
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (
      <TouchableHighlight
        style={styles.touchable}
        underlayColor={'#cccccc'}
        onPress={this._onPress}
        disabled={!this.props.hasInternet}>
        <Text style={styles.buttonText}>Use Current Location</Text>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  touchable: {
    flex: 0.5,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 100,
    marginVertical: 5,
    borderRadius: 10,
    // borderColor: 'black',
    // borderWidth: 2,
  },
  buttonText: {
    fontSize: 18,
  },
});

export {CurrLocButton};

import React, {PureComponent} from 'react';
import {Text, TouchableHighlight} from 'react-native';
import {getGeolocation} from '../../functions/geolocation.js';
import {styles} from './style.js';

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
    // console.log('render button');
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

export {CurrLocButton};

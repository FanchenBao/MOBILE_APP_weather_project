import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import validate from 'validate.js';
import {Forecast} from './forecast.js';
import {fetchWeatherInfo} from './fetch_weather_info.js'; // a function

/** The main class aggregating all app functionalities. */
class WeatherProject extends Component {
  constructor(props) {
    super(props);
    // state stores all info needed for the app.
    this.state = {
      hasModified: false, // wheather an input has been made
      isValid: false, // whether input zip code is valid
      zip: '',
      forecast: null,
    };
  }

  /**
   * Check whether the input zip code, which is currently in this.state, is of
   * valid format.If it is valid, return true, otherwise false.
   *
   * @param {string} zipInput The user-input zip code.
   * @returns {boolean} true if validation passes; otherwise false.
   */
  _isZipValid(zipInput) {
    return validate({zip: zipInput}, constraints) === undefined ? true : false;
  }

  /**
   * Obtain the weather info asynchronously, and then set the forcast item in
   * this.state.forecast accordingly. Note that other states are set here
   * as well to avoid extra call on this.setState().
   *
   * @param {string} zipInput The user-input zip code.
   */
  async _setStateForecast(zipInput) {
    try {
      let curr_forecast = await fetchWeatherInfo(zipInput);
      this.setState(
        {
          forecast: curr_forecast,
          isValid: true,
          hasModified: true,
          zip: zipInput,
        },
        () => console.log(this.state),
      );
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Handle user-input zip code.
   *
   * No matter what zip code is input, modify the state accordingly. Then check
   * the validity of input. If it is valid, pull weather forecast. Otherwise,
   * set the state to reflect invalid zip code input.
   *
   * @param {string} zipInput The user-input zip code.
   */
  _handleZipInput(zipInput) {
    // this.setState({hasModified: true, zip: zipInput});
    if (this._isZipValid(zipInput)) {
      // zip code input successful and it is different from previous input
      this._setStateForecast(zipInput);
    } else {
      // input invalid. record zip input, reset forecast, and set error msg type
      this.setState({
        zip: zipInput,
        forecast: null,
        isValid: false,
        hasModified: true,
      });
    }
  }

  /**
   * Produce welcome or error message based on this.state.
   */
  _welcomeOrErrorMsg() {
    if (this.state.isValid) {
      // valid zip code format
      return (
        <Text style={styles.welcome}>{`Weather forecast for ${
          this.state.zip
        }:`}</Text>
      );
    } else if (this.state.zip === '') {
      // no zip code input. If input has been modified, show error. If input has
      // not been modified, meaning the app has not been used yet, do not show
      // error.
      return this.state.hasModified ? (
        <Text style={styles.error}>{'Zip code required!'}</Text>
      ) : null;
    } else {
      // invalid zip code format.
      return <Text style={styles.error}>{'Zip code INVALID!'}</Text>;
    }
  }

  render() {
    // Produce a Forecast component based on whether this.state.forecast has
    // been populated.
    let weatherForecast = null;
    if (this.state.forecast !== null) {
      if (this.state.forecast.errorMsg === '') {
        weatherForecast = (
          <Forecast
            main={this.state.forecast.main}
            description={this.state.forecast.description}
            temp={this.state.forecast.temp}
            errorMsg={''}
            name={this.state.forecast.name}
          />
        );
      } else {
        weatherForecast = <Forecast errorMsg={this.state.forecast.errorMsg} />;
      }
    }

    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          onSubmitEditing={event =>
            this._handleZipInput(event.nativeEvent.text)
          }
          placeholder={'Input a zip code...'}
          keyboardType={'number-pad'}
        />
        {this._welcomeOrErrorMsg()}
        {weatherForecast}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {fontSize: 20, textAlign: 'center', margin: 10},
  input: {
    fontSize: 20,
    borderWidth: 2,
    padding: 2,
    height: 40,
    width: 200,
    textAlign: 'center',
    marginTop: 20,
  },
  error: {
    fontSize: 15,
    textAlign: 'center',
    margin: 5,
    color: 'red',
  },
});

const constraints = {
  zip: {
    // do not check for empty value here, because the regex pattern already
    // deems empty value as invalid
    format: {
      pattern: /\d{5}/, // regex pattern must be enclosed by forward slashes
    },
  },
};

export {WeatherProject};

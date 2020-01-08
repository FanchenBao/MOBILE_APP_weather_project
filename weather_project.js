import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  ImageBackground,
} from 'react-native';
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
  _errorMsg() {
    if (!this.state.isValid) {
      if (this.state.zip === '') {
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
      <ImageBackground
        source={require('./background.jpeg')}
        resizeMode="cover"
        style={styles.backdrop}>
        <View style={styles.overlay}>
          <View style={styles.row}>
            <Text style={styles.mainText}>{'Current weather for '}</Text>
            <View style={styles.zipContainer}>
              <TextInput
                style={[styles.zipCode, styles.mainText]}
                placeholder={'enter zip code'}
                placeholderTextColor={'grey'}
                keyboardType={'number-pad'}
                onSubmitEditing={event =>
                  this._handleZipInput(event.nativeEvent.text)
                }
              />
              <Text style={styles.zipError}>some word</Text>
            </View>
          </View>
          {/* {this._errorMsg()} */}
          {weatherForecast}
          <View style={styles.forecast}>
            <Text>hello</Text>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const baseFontSize = 20;
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    flexDirection: 'column',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  overlay: {
    paddingTop: 5,
    backgroundColor: '#333333',
    opacity: 0.7,
    flexDirection: 'column',
    alignItems: 'center',
    height: Dimensions.get('window').height / 2,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    paddingHorizontal: 20,
    flex: 1,
    // borderColor: 'blue',
    // borderWidth: 2,
  },
  zipContainer: {
    flex: 1,
    marginLeft: 5,
    justifyContent: 'center',
    // borderColor: 'black',
    // borderWidth: 2,
  },
  zipCode: {
    flex: 2,
    height: baseFontSize + 60,
    textAlign: 'center',
    borderBottomColor: 'white',
    borderBottomWidth: 2,
    // The paddings below are used to align input text with main text
    paddingTop: 27,
    paddingBottom: 0,
    // borderColor: '#DDDDDD',
    // borderWidth: 2,
  },
  mainText: {fontSize: baseFontSize, color: '#FFFFFF'},
  zipError: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'red',
    borderRadius: 10,
    marginHorizontal: 30,
    marginTop: 5,
  },
  forecast: {
    flex: 2,
    borderColor: 'yellow',
    borderWidth: 2,
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

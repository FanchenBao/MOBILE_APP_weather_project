import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  ImageBackground,
  ProgressBarAndroid,
} from 'react-native';
import validate from 'validate.js';
import NetInfo from '@react-native-community/netinfo';
import {Forecast, forecastStyles} from './forecast.js';
import {fetchWeatherInfo} from './fetch_weather_info.js'; // a function

/** The main class aggregating all app functionalities. */
class WeatherProject extends Component {
  constructor(props) {
    super(props);
    // state stores all info needed for the app.
    this.state = {
      hasModified: false, // wheather an input has been made
      zipIsValid: false, // whether input zip code is valid
      zip: '',
      // forecast: {
      //   // errorMsg: 'City not found',
      //   errorMsg: '',
      //   description: 'scattered clouds',
      //   main: 'Clouds',
      //   name: 'Schenectady',
      //   temp: '34.36',
      // },
      forecast: null,
      hasInternet: false,
      waiting: false,
    };
    this.unsubscribe = null; // dummy value. It will be set later.
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
      this.setState({forecast: curr_forecast, waiting: false}, () =>
        console.log(this.state),
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
      this.setState({
        zipIsValid: true,
        hasModified: true,
        zip: zipInput,
        waiting: true,
      });
      // zip code input successful. Force a one second delay to show spinner
      setTimeout(() => this._setStateForecast(zipInput), 1000);
    } else {
      // input invalid. record zip input, reset forecast, and set error msg type
      this.setState({
        zip: zipInput,
        forecast: null,
        zipIsValid: false,
        hasModified: true,
      });
    }
  }

  /**
   * Produce error message based on this.state.
   */
  _errorMsg() {
    if (this.state.hasInternet) {
      // all following checks makes sense if there is internet connection
      if (!this.state.zipIsValid) {
        if (this.state.zip === '') {
          // no zip code input. If input has been modified, show error. If input has
          // not been modified, meaning the app has not been used yet, do not show
          // error.
          return this.state.hasModified ? (
            <Text style={[styles.bubble, styles.error]}>Zip required</Text>
          ) : null;
        } else {
          // invalid zip code format.
          return <Text style={[styles.bubble, styles.error]}>Zip INVALID</Text>;
        }
      } else {
        return null;
      }
    } else {
      // no internet connection, report error
      return (
        <Text style={[styles.bubble, styles.warning]}>{'No  Internet'}</Text>
      );
    }
  }

  /** Display spinner if app is waiting on API call */
  _waiting() {
    if (this.state.waiting) {
      // return <ActivityIndicator size="small" color="#00ffff" />;
      return <ProgressBarAndroid styleAttr="Horizontal" color="#00ffff" />;
    } else {
      return null;
    }
  }

  componentDidMount() {
    // subscribe to NetInfo
    this.unsubscribe = NetInfo.addEventListener(state =>
      this.setState({hasInternet: state.isInternetReachable}),
    );
  }

  componentWillUnMount() {
    // unsubscribe to NetInfo to avoid memory leak.
    this.unsubscribe();
  }

  render() {
    // Placeholder
    let weatherForecast = <View style={forecastStyles.container} />;
    // Produce a Forecast component if forecast is available
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
          <View style={styles.waitContainer}>{this._waiting()}</View>
          <View style={styles.row}>
            <Text style={styles.mainText}>{'Current weather for '}</Text>
            <View style={styles.zipContainer}>
              <TextInput
                style={[styles.zipCode, styles.mainText]}
                placeholder={'zip code'}
                placeholderTextColor={'grey'}
                keyboardType={'number-pad'}
                onSubmitEditing={event =>
                  this._handleZipInput(event.nativeEvent.text)
                }
                editable={this.state.hasInternet}
              />
              <View style={styles.zipErrorContainer}>{this._errorMsg()}</View>
            </View>
          </View>
          {weatherForecast}
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
    height: (Dimensions.get('window').height / 5) * 3,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    paddingHorizontal: 40,
    flex: 1,
    // borderColor: 'blue',
    // borderWidth: 2,
  },
  waitContainer: {
    flex: 0.4,
    justifyContent: 'flex-start',
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
  zipErrorContainer: {
    flex: 1,
  },
  bubble: {
    fontSize: 14,
    textAlign: 'center',
    color: 'white',
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 5,
  },
  error: {
    backgroundColor: 'red',
  },
  warning: {
    backgroundColor: 'orange',
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

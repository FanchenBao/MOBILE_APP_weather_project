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
import NetInfo from '@react-native-community/netinfo';
import {Forecast, forecastStyles} from './components/forecast.js';
import {fetchWeatherInfo} from './functions/fetch_weather_info.js';
import {isZipValid} from './functions/zipInputValidation.js';
import {getFineLocationPermission} from './functions/geolocation.js';
import {ErrorBubble, WarningBubble} from './components/style_components.js';
import {CurrLocButton} from './components/currLocButton.js';

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
   * Obtain the weather info asynchronously, and then set the forcast item in
   * this.state.forecast accordingly. Note that other states are set here
   * as well to avoid extra call on this.setState().
   *
   * @param {Map} query The query type for weather info, e.g. zip code,
   * coordinate, etc. Must follow this format
   * {type: <type name>, value: <query value>}
   */
  _setStateForecast = async query => {
    try {
      let curr_forecast = await fetchWeatherInfo(query);
      this.setState({forecast: curr_forecast, waiting: false}, () =>
        console.log(this.state),
      );
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Handle user-input zip code.
   *
   * No matter what zip code is input, modify the state accordingly. Then check
   * the validity of input. If it is valid, pull weather forecast. Otherwise,
   * set the state to reflect invalid zip code input.
   *
   * @param {string} event The event passed by TextInput upon submitting.
   */
  _handleZipInput = event => {
    // this.setState({hasModified: true, zip: zipInput});
    let zipInput = event.nativeEvent.text;
    if (isZipValid(zipInput)) {
      this.setState({
        zipIsValid: true,
        hasModified: true,
        zip: zipInput,
        waiting: true,
      });
      // zip code input successful. Force a one second delay to show spinner
      setTimeout(
        () => this._setStateForecast({type: 'zip', value: zipInput}),
        1000,
      );
    } else {
      // input invalid. record zip input, reset forecast, and set error msg type
      this.setState({
        zip: zipInput,
        forecast: null,
        zipIsValid: false,
        hasModified: true,
      });
    }
  };

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
            <ErrorBubble>Zip required</ErrorBubble>
          ) : null;
        } else {
          // invalid zip code format.
          return <ErrorBubble>Zip INVALID</ErrorBubble>;
        }
      } else {
        return null;
      }
    } else {
      // no internet connection, report error
      return <WarningBubble>{'No Internet'}</WarningBubble>;
    }
  }

  /** Display spinner if app is waiting on API call */
  _renderWaiting() {
    if (this.state.waiting) {
      // return <ActivityIndicator size="small" color="#00ffff" />;
      return <ProgressBarAndroid styleAttr="Horizontal" color="#00ffff" />;
    } else {
      return null;
    }
  }

  _setToWait = () => this.setState({waiting: true});

  componentDidMount() {
    // subscribe to NetInfo
    this.unsubscribe = NetInfo.addEventListener(state =>
      this.setState({hasInternet: state.isInternetReachable}),
    );

    // ask permissio for geolocation. Once permission 'granted' or
    // 'never ask again', this function won't be triggered any more.
    getFineLocationPermission();
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
        source={require('./images/background.jpeg')}
        resizeMode="cover"
        style={styles.backdrop}>
        <View style={styles.overlay}>
          <View style={styles.waitContainer}>{this._renderWaiting()}</View>
          <View style={styles.row}>
            <Text style={styles.mainText}>{'Current weather for '}</Text>
            <View style={styles.zipContainer}>
              <TextInput
                style={[styles.zipCode, styles.mainText]}
                placeholder={'zip code'}
                placeholderTextColor={'grey'}
                keyboardType={'number-pad'}
                onSubmitEditing={this._handleZipInput}
                editable={this.state.hasInternet}
              />
              <View style={styles.zipErrorContainer}>{this._errorMsg()}</View>
            </View>
          </View>
          <CurrLocButton
            onPressCB={this._setStateForecast}
            setToWait={this._setToWait}
          />
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
    borderColor: 'blue',
    borderWidth: 2,
  },
  waitContainer: {
    flex: 0.1,
    justifyContent: 'flex-start',
    // borderColor: 'red',
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
  zipErrorContainer: {
    flex: 1,
  },
});

export {WeatherProject};

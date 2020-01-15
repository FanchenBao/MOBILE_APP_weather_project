import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  CityText,
  ErrorText,
  ForecastCategoryText,
  ForecastContentText,
} from './style_components.js';

/** A class to wrap the display of weather forecast */
class Forecast extends Component {
  /**
   * Determine whether to display city name corresponding to the zip input, or
   * error message notifying that the zip input does not correspond to a city.
   */
  _cityOrError() {
    if (this.props.errorMsg === '') {
      return <CityText>{this.props.name}</CityText>;
    } else {
      return <ErrorText>{this.props.errorMsg}</ErrorText>;
    }
  }

  /**
   * Display weather information, including condition and temperature.
   */
  _weatherInfo() {
    if (this.props.errorMsg === '') {
      return (
        <View style={forecastStyles.rowTwo}>
          <View style={forecastStyles.category}>
            <ForecastCategoryText>Condition:</ForecastCategoryText>
            <ForecastCategoryText>Temperature:</ForecastCategoryText>
          </View>
          <View style={forecastStyles.content}>
            <ForecastContentText>{this.props.description}</ForecastContentText>
            <ForecastContentText>{`${this.props.temp} °F`}</ForecastContentText>
          </View>
        </View>
      );
    } else {
      return <View style={forecastStyles.rowTwo} />;
    }
  }

  render() {
    return (
      <View style={forecastStyles.container}>
        <View style={forecastStyles.rowOne}>{this._cityOrError()}</View>
        {this._weatherInfo()}
      </View>
    );
  }
}

const forecastStyles = StyleSheet.create({
  container: {
    flex: 2,
    flexDirection: 'column',
    // borderColor: 'yellow',
    // borderWidth: 2,
  },
  rowOne: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //borderColor: 'green',
    //borderWidth: 2,
  },
  rowTwo: {
    flex: 2,
    flexDirection: 'row',
    //borderColor: 'orange',
    //borderWidth: 2,
  },
  category: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    //borderColor: 'brown',
    //borderWidth: 2,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    //borderColor: 'purple',
    //borderWidth: 2,
  },
});

export {Forecast, forecastStyles};

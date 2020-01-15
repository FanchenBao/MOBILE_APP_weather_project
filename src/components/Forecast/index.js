import React, {Component} from 'react';
import {View} from 'react-native';
import {
  CityText,
  ErrorText,
  ForecastCategoryText,
  ForecastContentText,
} from '../style_components.js';
import {styles} from './style.js';

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
        <View style={styles.rowTwo}>
          <View style={styles.category}>
            <ForecastCategoryText>Condition:</ForecastCategoryText>
            <ForecastCategoryText>Temperature:</ForecastCategoryText>
          </View>
          <View style={styles.content}>
            <ForecastContentText>{this.props.description}</ForecastContentText>
            <ForecastContentText>{`${this.props.temp} °F`}</ForecastContentText>
          </View>
        </View>
      );
    } else {
      return <View style={styles.rowTwo} />;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.rowOne}>{this._cityOrError()}</View>
        {this._weatherInfo()}
      </View>
    );
  }
}

export {Forecast};

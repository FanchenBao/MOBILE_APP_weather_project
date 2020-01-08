import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

/** A class to wrap the display of weather forecast */
class Forecast extends Component {
  _cityOrError() {
    if (this.props.errorMsg === '') {
      return <Text style={forecastStyles.cityText}>{this.props.name}</Text>;
    } else {
      return (
        <Text style={forecastStyles.errorText}>{this.props.errorMsg}</Text>
      );
    }
  }

  _weatherInfo() {
    if (this.props.errorMsg === '') {
      return (
        <View style={forecastStyles.rowTwo}>
          <View style={forecastStyles.category}>
            <Text style={forecastStyles.categoryText}>Condition:</Text>
            <Text style={forecastStyles.categoryText}>Temperature:</Text>
          </View>
          <View style={forecastStyles.content}>
            <Text style={forecastStyles.contentText}>
              {this.props.description}
            </Text>
            <Text style={forecastStyles.contentText}>{`${
              this.props.temp
            } °F`}</Text>
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

const bigTextSize = 40;
const regTextSize = 25;
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
    // borderColor: 'green',
    // borderWidth: 2,
  },
  rowTwo: {
    flex: 2,
    flexDirection: 'row',
    // borderColor: 'orange',
    // borderWidth: 2,
  },
  category: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    // borderColor: 'brown',
    // borderWidth: 2,
  },
  categoryText: {
    fontSize: regTextSize,
    marginLeft: 15,
    color: 'lightblue',
    fontWeight: 'bold',
    // borderColor: 'hotpink',
    // borderWidth: 2,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
    // borderColor: 'purple',
    // borderWidth: 2,
  },
  contentText: {
    fontSize: regTextSize,
    color: 'lightblue',
    // borderColor: 'lemonchiffon',
    // borderWidth: 2,
  },
  cityText: {
    fontSize: bigTextSize,
    color: 'lightblue',
  },
  errorText: {
    fontSize: bigTextSize,
    color: 'white',
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 10,
  },
});

export {Forecast, forecastStyles};

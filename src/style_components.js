import React, {Component} from 'react';
import {StyleSheet, Text} from 'react-native';

class CityText extends Component {
  render() {
    return (
      <Text style={[styles.bigText, styles.weatherColor]}>
        {this.props.children}
      </Text>
    );
  }
}

class CityNotFoundText extends Component {
  render() {
    return (
      <Text style={[styles.bigText, styles.error]}>{this.props.children}</Text>
    );
  }
}

class ForecastCategoryText extends Component {
  render() {
    return (
      <Text
        style={[
          styles.smallText,
          styles.bold,
          styles.category,
          styles.weatherColor,
        ]}>
        {this.props.children}
      </Text>
    );
  }
}

class ForecastContentText extends Component {
  render() {
    return (
      <Text style={[styles.smallText, styles.content, styles.weatherColor]}>
        {this.props.children}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  weatherColor: {
    color: '#66ff33',
  },
  error: {
    color: 'white',
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 10,
  },
  category: {
    marginLeft: 15,
    //borderColor: 'hotpink',
    //borderWidth: 2,
  },
  content: {
    marginRight: 30,
    //borderColor: 'lemonchiffon',
    //borderWidth: 2,
  },
  bigText: {
    fontSize: 40,
  },
  smallText: {
    fontSize: 20,
  },
  bold: {
    fontWeight: 'bold',
  },
  errorText: {
    color: 'white',
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 10,
  },
});

export {CityText, CityNotFoundText, ForecastCategoryText, ForecastContentText};

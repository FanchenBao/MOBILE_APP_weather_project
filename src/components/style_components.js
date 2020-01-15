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

class ErrorText extends Component {
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
          styles.mediumText,
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
      <Text style={[styles.mediumText, styles.content, styles.weatherColor]}>
        {this.props.children}
      </Text>
    );
  }
}

class ErrorBubble extends Component {
  render() {
    return (
      <Text style={[styles.errorBubble, styles.smallText]}>
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
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 10,
    fontSize: 20,
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
  mediumText: {
    fontSize: 20,
  },
  smallText: {
    fontSize: 14,
  },
  bold: {
    fontWeight: 'bold',
  },
  errorBubble: {
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 2,
    marginHorizontal: 10,
    marginTop: 5,
  },
});

export {
  CityText,
  ErrorText,
  ForecastCategoryText,
  ForecastContentText,
  ErrorBubble,
};

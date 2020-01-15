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
      <Text style={[styles.smallText, styles.bubble, styles.error]}>
        {this.props.children}
      </Text>
    );
  }
}

class WarningBubble extends Component {
  render() {
    return (
      <Text style={[styles.smallText, styles.bubble, styles.warning]}>
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
    padding: 2,
  },
  warning: {
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'orange',
    borderRadius: 10,
    padding: 2,
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
  bubble: {
    marginHorizontal: 10,
    marginTop: 5,
  },
});

export {
  CityText,
  CityNotFoundText,
  ForecastCategoryText,
  ForecastContentText,
  ErrorBubble,
  WarningBubble,
};

import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

/** A class to wrap the display of weather forecast */
class Forecast extends Component {
  render() {
    if (this.props.errorMsg === '') {
      return (
        <View style={styles.container}>
          <Text style={styles.bigText}>{this.props.name}</Text>
          <Text style={styles.mainText}>
            {`Conditions:\t\t${this.props.description}`}
          </Text>
          <Text style={styles.mainText}>{`Temperature:\t${
            this.props.temp
          }°F`}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>{this.props.errorMsg}</Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {height: 200, justifyContent: 'center'},
  bigText: {
    fontSize: 30,
    color: 'blue',
    margin: 5,
    textAlign: 'center',
  },
  mainText: {fontSize: 20, color: 'blue', margin: 5},
  errorText: {fontSize: 20, color: 'red', margin: 5},
});

export {Forecast};

import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

/** A class to wrap the display of weather forecast */
class Forecast extends Component {
  render() {
    if (this.props.errorMsg === '') {
      return (
        <View style={styles.container}>
          <Text style={styles.bigText}>{this.props.main}</Text>
          <Text style={styles.mainText}>
            {`Current conditions: ${this.props.description}`}
          </Text>
          <Text style={styles.bigText}>{`${this.props.temp}°F`}</Text>
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
  container: {height: 200},
  bigText: {
    flex: 2,
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'blue',
  },
  mainText: {flex: 1, fontSize: 16, textAlign: 'center', color: 'blue'},
  errorText: {flex: 1, fontSize: 16, textAlign: 'center', color: 'red'},
});

export {Forecast};

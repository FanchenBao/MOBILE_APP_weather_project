import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';

export default class WeatherProject extends Component {
  constructor(props) {
    super(props);
    this.state = {zip: ''};
  }

  _onChangeText(text) {
    console.log(text)
  }

  render() {
    return (
      <View>
        <TextInput
          onChangeText={text => this._onChangeText(text)}
          placeholder={"Please input a zip code..."}
          keyboardType={"number-pad"}
        />
        <Text>You have input {this.state.zip}</Text>
      </View>
    );
  }
}

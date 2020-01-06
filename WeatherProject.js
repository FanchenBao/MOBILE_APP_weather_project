import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import validate from 'validate.js';

export default class WeatherProject extends Component {
  constructor(props) {
    super(props);
    this.state = {zip: ''};
  }

  _validateZip() {
    let res = validate(this.state, constraints);
    console.log(res);
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          onChangeText={text => this.setState({zip: text})}
          onSubmitEditing={() => this._validateZip()}
          placeholder={'Input a zip code...'}
          keyboardType={'number-pad'}
        />
        <Text style={styles.welcome}>{`You have input zip code: ${
          this.state.zip
        }`}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {fontSize: 20, textAlign: 'center', margin: 10},
  input: {
    fontSize: 20,
    borderWidth: 2,
    padding: 2,
    height: 40,
    width: 200,
    textAlign: 'center',
  },
});

const constraints = {
  zip: {
    presence: {
      allowEmpty: false,
      message: 'required.',
    },
    format: {
      pattern: /\d{5}(-\d{4})?/, // regex pattern must be enclosed by forward slashes
      message: 'new error message',
    },
  },
};

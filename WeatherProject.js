import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import validate from 'validate.js';

export default class WeatherProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasModified: false,
      isValid: false,
      zip: '',
    };
  }

  _isZipValid() {
    /*
    Check whether the input zip code, which is currently in this.state, is of valid format.
    If it is valid, return true, otherwise false.
    */
    return validate(this.state, constraints) === undefined ? true : false;
  }

  _renderError() {
    /*
    pre-condition for calling this function is that zip code validate already fails. This function further
    distinguish whether the failure is due to zip code not being filled or invalid zip code.
    */
    if (this.state.zip === '') {
      // if state hasn't been modified, do not report error message.
      return this.state.hasModified ? 'Zip code is required!' : null;
    } else {
      return 'Zip code is invalid!';
    }
  }

  _displayMsgAfterZipInput() {
    if (this._isZipValid()) {
      return (
        <Text style={styles.welcome}>
          {`Great! Your zip code is ${this.state.zip}`}
        </Text>
      );
    } else {
      return <Text style={styles.error}>{this._renderError()}</Text>;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          onSubmitEditing={event =>
            this.setState({zip: event.nativeEvent.text, hasModified: true})
          }
          placeholder={'Input a zip code...'}
          keyboardType={'number-pad'}
        />
        {this._displayMsgAfterZipInput()}
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
  error: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'red',
  },
});

const constraints = {
  zip: {
    // do not check for empty value here, because the regex pattern alread deems empty value as invalid
    format: {
      pattern: /\d{5}/, // regex pattern must be enclosed by forward slashes
    },
  },
};

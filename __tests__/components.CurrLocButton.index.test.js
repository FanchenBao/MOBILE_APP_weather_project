import {CurrLocButton} from '../src/components/CurrLocButton/index.js';
import React from 'react';
import renderer from 'react-test-renderer';
import {getGeolocation} from '../src/functions/geolocation.js';
import {TouchableHighlight} from 'react-native';

let component;
let touchableHighlight;
let mockConsoleError;
let _setStateForecast;
let _setToWait;
// set up mocking for mockConsoleError. Also create the CurrLocButton component.
beforeEach(() => {
  // mock the function passed as props to CurrLocButton
  _setStateForecast = jest.fn(props => props);
  _setToWait = jest.fn(() => null);

  mockConsoleError = jest.spyOn(global.console, 'error').mockImplementation();
  // create a CurrLocButton component
  component = renderer.create(
    <CurrLocButton
      setStateForecast={_setStateForecast}
      setToWait={_setToWait}
      hasInternet={true}
    />,
  );
  // selected TouchableHighLight component
  touchableHighlight = component.root.findByType(TouchableHighlight);
});

// clean up console function mock after each test.
afterEach(() => {
  mockConsoleError.mockRestore();
});

// Mock app's own module
jest.mock('../src/functions/geolocation.js');
getGeolocation
  .mockImplementationOnce(
    async (successCallback, errorCallback, denyCallback) => {
      successCallback({coords: {latitude: 10, longitude: 20}}); // test 2
    },
  )
  .mockImplementationOnce(
    async (successCallback, errorCallback, denyCallback) => {
      denyCallback(); // test 3
    },
  )
  .mockImplementationOnce(
    async (successCallback, errorCallback, denyCallback) => {
      errorCallback({code: 1, message: 'foo'}); // test 4
    },
  )
  .mockRejectedValue('bar'); // test 5

// test 1
test('Snapshot on CurrLocButton', () => {
  expect(component.toJSON()).toMatchSnapshot();
});

// test 2
test('getGeolocation successCalback', async () => {
  await touchableHighlight.props.onPress();
  expect(_setStateForecast).toHaveBeenCalledTimes(1);
  expect(_setStateForecast).toHaveBeenCalledWith({
    type: 'coord',
    value: {
      lat: 10,
      lon: 20,
    },
  });
  expect(_setToWait).toHaveBeenCalledTimes(1);
  expect(mockConsoleError).not.toHaveBeenCalled();
});

// test 3
test('getGeolocation denyCallback', async () => {
  await touchableHighlight.props.onPress();
  expect(_setStateForecast).toHaveBeenCalledTimes(1);
  expect(_setStateForecast).toHaveBeenCalledWith({
    type: 'error',
    value: 'Obtain current location NOT allowed',
  });
  expect(_setToWait).toHaveBeenCalledTimes(1);
  expect(mockConsoleError).not.toHaveBeenCalled();
});

// test 4
test('getGeolocation errorCallback', async () => {
  await touchableHighlight.props.onPress();
  expect(_setStateForecast).toHaveBeenCalledTimes(1);
  expect(_setStateForecast).toHaveBeenCalledWith({
    type: 'error',
    value: 'Obtain current location failed',
  });
  expect(_setToWait).toHaveBeenCalledTimes(1);
  expect(mockConsoleError).toHaveBeenCalledTimes(1);
  expect(mockConsoleError).toHaveBeenCalledWith(1, 'foo');
});

test('getGeolocation unexpected error', async () => {
  await touchableHighlight.props.onPress();
  expect(_setStateForecast).not.toHaveBeenCalled();
  expect(_setToWait).toHaveBeenCalledTimes(1);
  expect(mockConsoleError).toHaveBeenCalledTimes(1);
  expect(mockConsoleError).toHaveBeenCalledWith('bar');
});

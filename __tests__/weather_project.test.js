import React from 'react';
import renderer from 'react-test-renderer';
import {TextInput, ProgressBarAndroid, View} from 'react-native';
import {WeatherProject} from '../src/weather_project.js';
import {fetchWeatherInfo} from '../src/functions/fetch_weather_info.js';
import {Forecast} from '../src/components/Forecast/index.js';
import {styles as forecastStyles} from '../src/components/Forecast/style.js';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-community/async-storage';

let mockConsoleLog;
let mockConsoleError;
let mockSetState;
let mockWeatherProject;
// set up mock console functions before each tests.
beforeEach(() => {
  mockConsoleLog = jest.spyOn(global.console, 'log').mockImplementation();
  mockConsoleError = jest.spyOn(global.console, 'error').mockImplementation();
  mockWeatherProject = renderer.create(<WeatherProject />);
  mockSetState = jest.spyOn(WeatherProject.prototype, 'setState');
});
// clean up console function mock after each test.
afterEach(() => {
  mockConsoleLog.mockRestore();
  mockConsoleError.mockRestore();
  mockSetState.mockRestore();
  mockWeatherProject.unmount();
});

// mock app's own module fetch_weather_info.js
jest.mock('../src/functions/fetch_weather_info.js');
fetchWeatherInfo
  .mockImplementationOnce(query => Promise.resolve('some forecast')) // test 1
  .mockImplementationOnce(query => Promise.reject('some rejection')) // test 2
  .mockImplementationOnce(query => Promise.resolve('some forecast')); // test 3

// mock Netinfo.addEventListener
const mockEventListener = jest.spyOn(NetInfo, 'addEventListener');

// mock AsyncStorage.getItem
const mockGetItem = jest.spyOn(AsyncStorage, 'getItem');

// simulate wait
const wait = async () => null;

// test 1
test('_setStateForecast success', async () => {
  const mockInstance = mockWeatherProject.getInstance();
  await mockInstance._setStateForecast('some query');
  expect(mockConsoleLog).toHaveBeenCalledTimes(1);
  expect(mockConsoleLog).toHaveBeenCalledWith({
    hasModified: false,
    zipIsValid: false,
    zip: '',
    forecast: 'some forecast',
    hasInternet: false,
    waiting: false,
  });
  expect(mockConsoleError).not.toHaveBeenCalled();
  expect(mockSetState).toHaveBeenCalledTimes(1);
  expect(
    mockSetState.mock.calls[mockSetState.mock.calls.length - 1][0],
  ).toEqual({
    forecast: 'some forecast',
    waiting: false,
  });
});

// test 2
test('_setStateForecast error', async () => {
  const mockInstance = mockWeatherProject.getInstance();
  await mockInstance._setStateForecast('some query');
  expect(mockConsoleLog).not.toHaveBeenCalled();
  expect(mockConsoleError).toHaveBeenCalledTimes(1);
  expect(mockConsoleError).toHaveBeenCalledWith('some rejection');
});

// test 3
test('_handleZipInput input valid', async () => {
  const mockTextInput = mockWeatherProject.root.findByType(TextInput);
  // for whatever reason, the await here causes componentDidMount() to complete
  // execution. Yet the same await in test 4 does not lead to the same behavior.
  // This causes the drop of testing on mockConsoleLog, as console.log also
  // outputs info about the execution of componentDidMount() in this test.
  await mockTextInput.props.onSubmitEditing({nativeEvent: {text: '12345'}});
  expect(mockSetState).toHaveBeenCalledTimes(2);
  expect(mockSetState).toHaveBeenCalledWith({
    zipIsValid: true,
    hasModified: true,
    zip: '12345',
    waiting: true,
  });
  expect(
    mockSetState.mock.calls[mockSetState.mock.calls.length - 1][0],
  ).toEqual({
    forecast: 'some forecast',
    waiting: false,
  });
  expect(mockConsoleError).not.toHaveBeenCalled();
  expect(mockWeatherProject.toJSON()).toMatchSnapshot();
});

// test 4
test('_handleZipInput input INVALID', async () => {
  const mockTextInput = mockWeatherProject.root.findByType(TextInput);
  await mockTextInput.props.onSubmitEditing({nativeEvent: {text: '1234S'}});
  expect(mockSetState).toHaveBeenCalledTimes(1);
  expect(mockSetState).toHaveBeenCalledWith({
    zipIsValid: false,
    hasModified: true,
    zip: '1234S',
    forecast: null,
  });
  expect(mockConsoleLog).not.toHaveBeenCalled();
  expect(mockConsoleError).not.toHaveBeenCalled();
  expect(mockWeatherProject.toJSON()).toMatchSnapshot();
});

// test 5
test('render zip required error bubble', async () => {
  const mockInstance = mockWeatherProject.getInstance();
  mockInstance.setState({hasModified: true});
  expect(mockSetState).toHaveBeenCalledTimes(1);
  expect(mockSetState).toHaveBeenCalledWith({hasModified: true});
  expect(mockWeatherProject.toJSON()).toMatchSnapshot();
});

// test 6
test('_setToWait behaves as expected, render waiting bar', async () => {
  const mockInstance = mockWeatherProject.getInstance();
  mockInstance._setToWait();
  expect(mockSetState).toHaveBeenCalledTimes(1);
  expect(mockSetState).toHaveBeenCalledWith({waiting: true});
  expect(mockInstance._renderWaiting()).toStrictEqual(
    <ProgressBarAndroid styleAttr="Horizontal" color="#00ffff" />,
  );
  expect(mockWeatherProject.toJSON()).toMatchSnapshot();
});

// test 7
test('render No Internet', async () => {
  const mockInstance = mockWeatherProject.getInstance();
  expect(mockInstance._renderForecast()).toStrictEqual(
    <Forecast errorMsg={'No Internet'} />,
  );
  const mockTextInput = mockWeatherProject.root.findByType(TextInput);
  expect(mockTextInput.props.editable).toBeFalsy();
  expect(mockConsoleError).not.toHaveBeenCalled();
  expect(mockConsoleLog).not.toHaveBeenCalled();
  expect(mockSetState).not.toHaveBeenCalled();
  expect(mockWeatherProject.toJSON()).toMatchSnapshot();
});

// test 8

test('NetInfo shows there is internet, but no forecast', async () => {
  mockEventListener.mockImplementationOnce(cb =>
    cb({isInternetReachable: true}),
  );
  mockWeatherProject = renderer.create(<WeatherProject />);
  await wait(); // wait for componentDidMount() to complete
  expect(mockSetState).toHaveBeenCalledTimes(1);
  expect(mockSetState).toHaveBeenCalledWith({hasInternet: true});
  expect(mockWeatherProject.getInstance()._renderForecast()).toStrictEqual(
    <View style={forecastStyles.container} />,
  );
  expect(mockWeatherProject.toJSON()).toMatchSnapshot();
});

// test 9
test('NetInfo shows internet on, and there is valid forecast', async () => {
  mockEventListener.mockImplementationOnce(cb =>
    cb({isInternetReachable: true}),
  );
  mockWeatherProject = renderer.create(<WeatherProject />);
  await wait(); // wait for componentDidMount() to complete
  expect(mockSetState).toHaveBeenCalledTimes(1);
  expect(mockSetState).toHaveBeenCalledWith({hasInternet: true});
  const mockInstance = mockWeatherProject.getInstance();
  mockInstance.setState({
    forecast: {
      main: 'Clear',
      description: 'clear sky',
      temp: '10',
      name: 'some city',
      errorMsg: '',
    },
  });
  expect(mockInstance._renderForecast()).toStrictEqual(
    <Forecast
      main={'Clear'}
      description={'clear sky'}
      temp={'10'}
      errorMsg={''}
      name={'some city'}
    />,
  );
  expect(mockWeatherProject.toJSON()).toMatchSnapshot();
});

// test 10
test('NetInfo shows internet on, but forecast has error msg', async () => {
  mockEventListener.mockImplementationOnce(cb =>
    cb({isInternetReachable: true}),
  );
  mockWeatherProject = renderer.create(<WeatherProject />);
  await wait(); // wait for componentDidMount() to complete
  expect(mockSetState).toHaveBeenCalledTimes(1);
  expect(mockSetState).toHaveBeenCalledWith({hasInternet: true});
  const mockInstance = mockWeatherProject.getInstance();
  mockInstance.setState({
    forecast: {
      errorMsg: 'City Not Found',
    },
  });
  expect(mockInstance._renderForecast()).toStrictEqual(
    <Forecast errorMsg={'City Not Found'} />,
  );
  expect(mockWeatherProject.toJSON()).toMatchSnapshot();
});

// test 11
test('AsyncStorage has no value', async () => {
  mockGetItem.mockImplementationOnce(key => Promise.resolve(null));
  mockWeatherProject = renderer.create(<WeatherProject />);
  await wait(); // wait for componentDidMount() to complete
  expect(mockConsoleLog).toHaveBeenCalledTimes(1);
  expect(mockConsoleLog).toHaveBeenCalledWith('No cached weahther info');
  expect(mockSetState).not.toHaveBeenCalled();
});

// test 12
test('AsyncStorage has value (an error msg)', async () => {
  mockGetItem.mockImplementationOnce(key =>
    Promise.resolve(JSON.stringify({errorMsg: 'City Not Found'})),
  );
  mockWeatherProject = renderer.create(<WeatherProject />);
  await wait(); // wait for componentDidMount() to complete
  expect(mockConsoleLog).not.toHaveBeenCalled();
  expect(mockSetState).toHaveBeenCalledTimes(1);
  expect(mockSetState).toHaveBeenCalledWith({
    forecast: {errorMsg: 'City Not Found'},
    waiting: false,
  });
});

// test 13
test('whether unsubscribe is called upon unmount', async () => {
  const mockInstance = mockWeatherProject.getInstance();
  const mockUnsubscribe = jest.spyOn(mockInstance, 'unsubscribe');
  mockInstance.componentWillUnMount();
  expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
});

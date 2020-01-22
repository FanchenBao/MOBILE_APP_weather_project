import {PhotoBackdrop} from '../src/components/PhotoBackdrop/index.js';
import {getReadExternalStoragePermission} from '../src/functions/get_user_permission.js';
import CameraRoll from '@react-native-community/cameraroll';
import React from 'react';
import renderer from 'react-test-renderer';

let mockConsoleLog;
let mockConsoleError;
let mockSetState;
let component;
// set up mock console functions before each tests.
beforeEach(async () => {
  mockConsoleLog = jest.spyOn(global.console, 'log').mockImplementation();
  mockConsoleError = jest.spyOn(global.console, 'error').mockImplementation();

  // use prototype to access setState()
  mockSetState = jest.spyOn(PhotoBackdrop.prototype, 'setState');

  // create a PhotoBackdrop component and use wait() to wait for the component
  // to update its state based on the mock return of
  // getReadExternalStoragePermission.
  component = renderer.create(<PhotoBackdrop />);
  await wait(); // wait for state update
});

// clean up console function mock after each test.
afterEach(() => {
  mockConsoleLog.mockRestore();
  mockConsoleError.mockRestore();
  mockSetState.mockRestore();
});

// mock app's own module
jest.mock('../src/functions/get_user_permission.js');
getReadExternalStoragePermission
  .mockResolvedValueOnce('granted') // test 1
  .mockResolvedValueOnce('custom_denied') // test 2
  .mockRejectedValueOnce('oops'); // test 3

// Mock CameraRoll.getPhotos. This is possible because the interface of this
// library is already mocked in
// @react-native-community/cameraroll/js/__mock__/nativeInterface.js
CameraRoll.getPhotos = jest.fn(prop =>
  Promise.resolve({edges: [{node: {image: {uri: 'some uri'}}}]}),
);

const wait = async () => 'foo'; // a dummy function to simulate waiting

// test 1
test('render PhotoBackdrop with user photo', () => {
  expect(component.toJSON()).toMatchSnapshot(); // uri should be 'some uri'
  expect(mockConsoleLog).not.toHaveBeenCalled();
  expect(mockConsoleError).not.toHaveBeenCalled();
  expect(mockSetState).toHaveBeenCalledTimes(1);
  expect(mockSetState).toHaveBeenLastCalledWith({photoURIs: ['some uri']});
});

// test 2
test('cannot render PhotoBacdrop due to user denied permission', () => {
  expect(component.toJSON()).toMatchSnapshot();
  expect(mockConsoleLog).toHaveBeenCalledTimes(1);
  expect(mockConsoleLog).toHaveBeenCalledWith(
    'Read external storage denied. User decision: custom_denied',
  );
  expect(mockConsoleError).not.toHaveBeenCalled();
  expect(mockSetState).not.toHaveBeenCalled();
});

// test 3
test('Error occurs when getting user permission or photos', () => {
  expect(mockConsoleLog).not.toHaveBeenCalled();
  expect(mockConsoleError).toHaveBeenCalledTimes(1);
  expect(mockConsoleError).toHaveBeenLastCalledWith('oops');
  expect(mockSetState).not.toHaveBeenCalled();
});

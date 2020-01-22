import {PhotoBackdrop} from '../src/components/PhotoBackdrop/index.js';
import {getReadExternalStoragePermission} from '../src/functions/get_user_permission.js';
import CameraRoll from '@react-native-community/cameraroll';
import React from 'react';
import renderer from 'react-test-renderer';

let mockConsoleLog;
let mockConsoleError;
let mockSetState;
// set up mock console functions before each tests.
beforeEach(() => {
  mockConsoleLog = jest.spyOn(global.console, 'log').mockImplementation();
  mockConsoleError = jest.spyOn(global.console, 'error').mockImplementation();
  // use prototype to access setState()
  mockSetState = jest.spyOn(PhotoBackdrop.prototype, 'setState');
});
// clean up console function mock after each test.
afterEach(() => {
  mockConsoleLog.mockRestore();
  mockConsoleError.mockRestore();
});

// mock app's own module
jest.mock('../src/functions/get_user_permission.js');
// Mock CameraRoll.getPhotos. This is possible because the interface of this
// library is already mocked in
// @react-native-community/cameraroll/js/__mock__
CameraRoll.getPhotos = jest.fn(prop =>
  Promise.resolve({edges: [{node: {image: {uri: 'some uri'}}}]}),
);

describe('Obtain user photo successful', () => {
  getReadExternalStoragePermission.mockResolvedValue('granted');
  test('_getMostRecentPhoto successfully gets most recent photo', async () => {
    // use react-test-render to get an instance of <PhotoBackdrop />, such that
    // we can test the function inside the component.
    await renderer
      .create(<PhotoBackdrop />)
      .getInstance()
      ._getMostRecentPhoto();
    expect(mockConsoleLog).not.toHaveBeenCalled();
    expect(mockConsoleError).not.toHaveBeenCalled();
    expect(mockSetState).toHaveBeenLastCalledWith({photoURIs: ['some uri']});
  });

  it('render PhotoBackdrop with user photo', () => {
    const tree = renderer.create(<PhotoBackdrop />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

import {NativeModules} from 'react-native';
import RNCNetInfoMock from '@react-native-community/netinfo/jest/netinfo-mock.js';
import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';

// Instruction for setting this file up is available at
// https://github.com/react-native-community/react-native-netinfo#errors-while-running-jest-tests
NativeModules.RNCNetInfo = RNCNetInfoMock;

// See mock instruction for async-storage here:
// https://github.com/react-native-community/async-storage/blob/LEGACY/docs/Jest-integration.md
jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);

// Mock RNCGeolocation, which is used in react-native-geolocation. This is
// borrowed from the link below, but I moved the logic to this file so that I
// don't need to keep the __mock__ folder for now.
// https://github.com/react-native-community/react-native-geolocation/issues/44#issuecomment-512720306
jest.mock('@react-native-community/geolocation', () => {
  return {
    addListener: jest.fn(),
    getCurrentPosition: jest.fn(),
    removeListeners: jest.fn(),
    requestAuthorization: jest.fn(),
    setConfiguration: jest.fn(),
    startObserving: jest.fn(),
    stopObserving: jest.fn(),
  };
});

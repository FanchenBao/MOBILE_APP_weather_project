// mock @react-native-community/geolocation
// This module is not directly used in the project, but used by
// react-native-geolocation-service

export default {
  addListener: jest.fn(),
  getCurrentPosition: jest.fn(),
  removeListeners: jest.fn(),
  requestAuthorization: jest.fn(),
  setConfiguration: jest.fn(),
  startObserving: jest.fn(),
  stopObserving: jest.fn(),
};

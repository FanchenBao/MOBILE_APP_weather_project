import {getGeolocation} from '../src/functions/geolocation.js';
import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid} from 'react-native';
import {getFineLocationPermission} from '../src/functions/get_user_permission.js';

// Mock PermissionsAndroid.check
jest
  .spyOn(PermissionsAndroid, 'check')
  .mockResolvedValueOnce(true) // test 1
  .mockResolvedValueOnce(true) // test 2
  .mockResolvedValueOnce(false) // test 3, first round
  .mockResolvedValueOnce(true) // test 3, second recursion round
  .mockResolvedValueOnce(false) // test 4
  .mockRejectedValueOnce('permission check error'); // test 5

// Mock Geolocation.getCurrentPosition. The initial mock work has been done in
// jest.setup.js, so here we can directy mock the implementation.
Geolocation.getCurrentPosition
  .mockImplementationOnce((scb, ecb, prop) => scb()) // test 1
  .mockImplementationOnce((scb, ecb, prop) => ecb()) // test 2
  .mockImplementationOnce((scb, ecb, prop) => scb()); // test 3

// Mock getFineLocationPermission from app's own module.
jest.mock('../src/functions/get_user_permission.js');
getFineLocationPermission
  .mockResolvedValueOnce('granted')
  .mockResolvedValueOnce('denied');

let mockSuccessCallBack;
let mockFailCallBack;
let mockDenyCallBack;
let mockConsoleLog;
let mockConsoleError;
// set up mock callbacks and mock console functions before each tests.
beforeEach(() => {
  mockSuccessCallBack = jest.fn();
  mockFailCallBack = jest.fn();
  mockDenyCallBack = jest.fn();
  mockConsoleLog = jest.spyOn(global.console, 'log').mockImplementation();
  mockConsoleError = jest.spyOn(global.console, 'error').mockImplementation();
});
// clean up console function mock after each test.
afterEach(() => {
  mockConsoleLog.mockRestore();
  mockConsoleError.mockRestore();
});

/** test 1 */
test('User permission ok, getCurrentPosition ok', async () => {
  await getGeolocation(mockSuccessCallBack, mockFailCallBack, mockDenyCallBack);
  expect(mockSuccessCallBack).toHaveBeenCalledTimes(1);
  expect(mockFailCallBack).not.toHaveBeenCalled();
  expect(mockDenyCallBack).not.toHaveBeenCalled();
  expect(mockConsoleLog).not.toHaveBeenCalled();
  expect(mockConsoleError).not.toHaveBeenCalled();
});

/** test 2 */
test('User permission ok, getCurrentPosition fail', async () => {
  await getGeolocation(mockSuccessCallBack, mockFailCallBack, mockDenyCallBack);
  expect(mockSuccessCallBack).not.toHaveBeenCalled();
  expect(mockFailCallBack).toHaveBeenCalledTimes(1);
  expect(mockDenyCallBack).not.toHaveBeenCalled();
  expect(mockConsoleLog).not.toHaveBeenCalled();
  expect(mockConsoleError).not.toHaveBeenCalled();
});

/** test 3 */
test('User permission fail, getFineLocationPermission ok', async () => {
  await getGeolocation(mockSuccessCallBack, mockFailCallBack, mockDenyCallBack);
  expect(mockSuccessCallBack).toHaveBeenCalledTimes(1);
  expect(mockFailCallBack).not.toHaveBeenCalled();
  expect(mockDenyCallBack).not.toHaveBeenCalled();
  expect(mockConsoleLog).toHaveBeenCalledTimes(2);
  expect(mockConsoleLog).toHaveBeenCalledWith(
    'Not allowed to access fine location. Ask for permission',
  );
  expect(mockConsoleLog).toHaveBeenCalledWith('Geolocation permission granted');
  expect(mockConsoleError).not.toHaveBeenCalled();
});

/** test 4 */
test('User permission fail, getFineLocationPermission fail', async () => {
  await getGeolocation(mockSuccessCallBack, mockFailCallBack, mockDenyCallBack);
  expect(mockSuccessCallBack).not.toHaveBeenCalled();
  expect(mockFailCallBack).not.toHaveBeenCalled();
  expect(mockDenyCallBack).toHaveBeenCalledTimes(1);
  expect(mockConsoleLog).toHaveBeenCalledTimes(2);
  expect(mockConsoleLog).toHaveBeenCalledWith(
    'Not allowed to access fine location. Ask for permission',
  );
  expect(mockConsoleLog).toHaveBeenCalledWith(
    'Geolocation denied. User decision: denied',
  );
  expect(mockConsoleError).not.toHaveBeenCalled();
});

/** test 5 */
test('Some error occurs', async () => {
  await getGeolocation(mockSuccessCallBack, mockFailCallBack, mockDenyCallBack);
  expect(mockSuccessCallBack).not.toHaveBeenCalled();
  expect(mockFailCallBack).not.toHaveBeenCalled();
  expect(mockDenyCallBack).not.toHaveBeenCalled();
  expect(mockConsoleLog).not.toHaveBeenCalled();
  expect(mockConsoleError).toHaveBeenCalledTimes(1);
  expect(mockConsoleError).toHaveBeenCalledWith('permission check error');
});

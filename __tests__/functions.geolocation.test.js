import {getGeolocation} from '../src/functions/geolocation.js';

// Mock two methods in PermissionsAndroid
jest.mock('react-native', () => {
  return {
    PermissionsAndroid: {
      check: jest
        .fn()
        .mockResolvedValueOnce(true) // test 1
        .mockResolvedValueOnce(true) // test 2
        .mockResolvedValueOnce(false) // test 3, first round
        .mockResolvedValueOnce(true) // test 3, second recursion round
        .mockResolvedValueOnce(false) // test 4
        .mockRejectedValueOnce('permission check error'), // test 5
      PERMISSIONS: {ACCESS_FINE_LOCATION: 'foo'},
      RESULTS: {GRANTED: 'granted'},
    },
  };
});

// Mock Geolocation.getCurrentPosition. Note that since it has already been
// mocked manually in __mock__ folder, all we need to do is to modify the
// behavior of getCurrentPosition from the manual mock.
jest.mock('../__mocks__/@react-native-community/geolocation.js', () => {
  return {
    getCurrentPosition: jest
      .fn()
      .mockImplementationOnce((scb, ecb, prop) => scb()) // test 1
      .mockImplementationOnce((scb, ecb, prop) => ecb()) // test 2
      .mockImplementationOnce((scb, ecb, prop) => scb()), // test 3
  };
});

// Mock getFineLocationPermission from app's own module.
jest.mock('../src/functions/get_user_permission.js', () => {
  return {
    getFineLocationPermission: jest
      .fn()
      .mockResolvedValueOnce('granted') // test 3
      .mockResolvedValueOnce('denied'), // test 4
  };
});

/** test 1 */
test('User permission ok, get location ok', async () => {
  let mockSuccessCallBack = jest.fn();
  let mockFailCallBack = jest.fn();
  let mockDenyCallBack = jest.fn();
  await getGeolocation(mockSuccessCallBack, mockFailCallBack, mockDenyCallBack);
  expect(mockSuccessCallBack).toHaveBeenCalledTimes(1);
  expect(mockFailCallBack).not.toHaveBeenCalled();
  expect(mockDenyCallBack).not.toHaveBeenCalled();
});

/** test 2 */
test('User permission ok, get location fail', async () => {
  let mockSuccessCallBack = jest.fn();
  let mockFailCallBack = jest.fn();
  let mockDenyCallBack = jest.fn();
  await getGeolocation(mockSuccessCallBack, mockFailCallBack, mockDenyCallBack);
  expect(mockSuccessCallBack).not.toHaveBeenCalled();
  expect(mockFailCallBack).toHaveBeenCalledTimes(1);
  expect(mockDenyCallBack).not.toHaveBeenCalled();
});

/** test 3 */
test('User permission fail, getFineLocationPermission ok', async () => {
  let mockSuccessCallBack = jest.fn();
  let mockFailCallBack = jest.fn();
  let mockDenyCallBack = jest.fn();
  let console_spy = jest.spyOn(global.console, 'log');
  await getGeolocation(mockSuccessCallBack, mockFailCallBack, mockDenyCallBack);
  expect(mockSuccessCallBack).toHaveBeenCalledTimes(1);
  expect(mockFailCallBack).not.toHaveBeenCalled();
  expect(mockDenyCallBack).not.toHaveBeenCalled();
  expect(console_spy).toHaveBeenCalledTimes(2);
  expect(console_spy).toHaveBeenCalledWith(
    'Not allowed to access fine location. Ask for permission',
  );
  expect(console_spy).toHaveBeenCalledWith('Geolocation permission granted');
  console_spy.mockRestore();
});

/** test 4 */
test('User permission fail, getFineLocationPermission fail', async () => {
  let mockSuccessCallBack = jest.fn();
  let mockFailCallBack = jest.fn();
  let mockDenyCallBack = jest.fn();
  let console_spy = jest.spyOn(global.console, 'log');
  await getGeolocation(mockSuccessCallBack, mockFailCallBack, mockDenyCallBack);
  expect(mockSuccessCallBack).not.toHaveBeenCalled();
  expect(mockFailCallBack).not.toHaveBeenCalled();
  expect(mockDenyCallBack).toHaveBeenCalledTimes(1);
  expect(console_spy).toHaveBeenCalledTimes(2);
  expect(console_spy).toHaveBeenCalledWith(
    'Not allowed to access fine location. Ask for permission',
  );
  expect(console_spy).toHaveBeenCalledWith(
    'Geolocation denied. User decision: denied',
  );
  console_spy.mockRestore();
});

/** test 5 */
test('Some error occurs', async () => {
  let mockSuccessCallBack = jest.fn();
  let mockFailCallBack = jest.fn();
  let mockDenyCallBack = jest.fn();
  let console_spy = jest.spyOn(global.console, 'error');
  await getGeolocation(mockSuccessCallBack, mockFailCallBack, mockDenyCallBack);
  expect(mockSuccessCallBack).not.toHaveBeenCalled();
  expect(mockFailCallBack).not.toHaveBeenCalled();
  expect(mockDenyCallBack).not.toHaveBeenCalled();
  expect(console_spy).toHaveBeenCalledTimes(1);
  expect(console_spy).toHaveBeenCalledWith('permission check error');
  console_spy.mockRestore();
});

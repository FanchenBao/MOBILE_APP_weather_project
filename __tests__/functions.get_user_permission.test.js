import {getUserPermission} from '../src/functions/get_user_permission.js';

// Mock 'PermissionsAndroid.request' function for testing functionality of
// getUserPermission.
jest.mock('react-native', () => {
  return {
    PermissionsAndroid: {
      request: jest
        .fn()
        .mockResolvedValueOnce('granted')
        .mockResolvedValueOnce('denied')
        .mockRejectedValueOnce('error'),
    },
  };
});

test('Granted permission', async () => {
  await expect(getUserPermission('Granted permission', '', '')).resolves.toBe(
    'granted',
  );
});

test('Denied permission', async () => {
  await expect(getUserPermission('Denied permission', '', '')).resolves.toBe(
    'denied',
  );
});

/**
 * Since rejected value from PermissionsAndroid.request is caught in
 * getUserPermission, it is not possible to test it using .rejects.toThrow().
 * The only way to test is to check whether console.error has been called as
 * expected. Hence the mock of console.error.
 *
 * Also note that, the mock of console.error via jest.spyOn must live inside the
 * test function. The spyOn mock allows user to track the usage of console.error
 * (see this post for details: https://codewithhugo.com/jest-fn-spyon-stub-mock/)
 */
test('Error permission', async () => {
  // Mock console.error
  let console_spy = jest.spyOn(global.console, 'error');
  await getUserPermission('Error permission', '', '');
  // Test error permission by checking how many times console.error is called
  // and what it is called with.
  expect(console_spy).toHaveBeenCalledTimes(1);
  expect(console_spy).toHaveBeenLastCalledWith('error');
  console_spy.mockRestore();
});

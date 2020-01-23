//@flow
import {PermissionsAndroid} from 'react-native';

/**
 * Ask for user to grant specific permission.
 * @param {string} permission The specific permission to be granted or denied.
 * @param {string} title Title for the rationale.
 * @param {string} msg Message in the rationale.
 */
async function getUserPermission(
  permission: string,
  title: string,
  msg: string,
) {
  try {
    let userDecision = await PermissionsAndroid.request(permission, {
      // rationale for obtaining fine location permission
      title: title,
      message: msg,
      buttonNeutral: 'Give Permission',
    });
    return userDecision;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Ask for user permission to access device's fine location.
 * @returns A promise that evaluates to user's decision.
 */
const getFineLocationPermission = () =>
  getUserPermission(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    'Weather Project App Geolocation Permission',
    'Weathr Project App needs access to your geolocation to provide weather information for your current location.',
  );

/**
 * Ask for user permission to read device's external storage.
 * @returns A promise that evaluates to user's decision.
 */
const getReadExternalStoragePermission = () =>
  getUserPermission(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    'Weather Project App Read External Storage Permission',
    'Weather Project App needs access to your external storage so that you can set background to your own photo.',
  );

export {
  getUserPermission,
  getFineLocationPermission,
  getReadExternalStoragePermission,
};

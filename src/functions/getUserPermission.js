import {PermissionsAndroid} from 'react-native';

/**
 * Ask for user to grant specific permission.
 * @param {string} permission The specific permission to be granted or denied.
 * @param {string} title Title for the rationale.
 * @param {string} msg Message in the rationale.
 */
async function getUserPermission(permission, title, msg) {
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

export {getUserPermission};

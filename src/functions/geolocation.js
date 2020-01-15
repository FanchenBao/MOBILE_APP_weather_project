import {PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {getFineLocationPermission} from './get_user_permission.js';

/**
 * Obtain geo location from the device.
 *
 * This function first checks whether permission has been granted for obtaining
 * geo location. If yes, it proceeds to get the geo location. If not, it asks
 * user for the permission.
 *
 * @param {Function} successCallback Callback when geo location has been
 * successfully obtained.
 * @param {Function} errorCallback Callback when there is an error in getting
 * geo location.
 * @param {Function} denyCallback Callback when user explicitly denies geo
 * location access.
 */
async function getGeolocation(successCallback, errorCallback, denyCallback) {
  try {
    let hasLocationPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(successCallback, errorCallback, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      });
    } else {
      console.log('Not allowed to access fine location. Ask for permission');
      let userDecision = await getFineLocationPermission();
      if (userDecision === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Geolocation permission granted');
        await getGeolocation(successCallback, errorCallback, denyCallback);
      } else {
        console.log(`Geolocation denied. User decision: ${userDecision}`);
        denyCallback();
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export {getGeolocation};

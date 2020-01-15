import {PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

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
      let userPerm = await getFineLocationPermission();
      if (userPerm === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Geolocation permission granted');
        getGeolocation(successCallback, errorCallback, denyCallback);
      } else {
        console.log(`Geolocation denied. User decision: ${userPerm}`);
        denyCallback();
      }
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * Ask for user permission to access device's fine location.
 */
async function getFineLocationPermission() {
  try {
    let userDecision = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        // rationale for obtaining fine location permission
        title: 'Weather Project App Geolocation Permission',
        message:
          'Weathr Project App needs access to your geolocation to provide weather information for your current location.',
        buttonNeutral: 'Give Permission',
      },
    );
    return userDecision;
  } catch (error) {
    console.error(error);
  }
}

export {getGeolocation, getFineLocationPermission};

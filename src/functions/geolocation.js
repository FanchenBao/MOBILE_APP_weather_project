import {PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

async function getGeolocation() {
  try {
    let hasLocationPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        position => {
          console.log(position);
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    } else {
      console.log('Not allowed to access fine location. Ask for permission');
      let userPerm = await this._getFineLocationPermission();
      if (userPerm === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Geolocation permission granted');
        getGeolocation();
      } else {
        console.log(`Geolocation denied. User decision: ${userPerm}`);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function getFineLocationPermission() {
  try {
    let userDecision = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
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

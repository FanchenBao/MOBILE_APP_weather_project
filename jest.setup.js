/**
 * Instruction for setting this file up is available at
 * https://github.com/react-native-community/react-native-netinfo#errors-while-running-jest-tests
 *
 * However, we have to change the file path for `netinfo-mock.js` as it is NOT
 * located at <root>/jest/netinfo-mock.js but inside `node_modules`.
 */

/**
 * UPDATE: after learning to manually mock geolocation, I used the same method
 * to mock netinfo (i.e. creating __mock__/@react-native-community/netinfo.js)
 * and it appeared to be working so far. Hence, for the time being, I will leave
 * the code below commented out.
 */

// import {NativeModules} from 'react-native';
// import RNCNetInfoMock from './node_modules/@react-native-community/netinfo/jest/netinfo-mock.js';

// NativeModules.RNCNetInfo = RNCNetInfoMock;

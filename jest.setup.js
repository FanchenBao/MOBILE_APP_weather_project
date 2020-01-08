/**
 * Instruction for setting this file up is available at
 * https://github.com/react-native-community/react-native-netinfo#errors-while-running-jest-tests
 *
 * However, we have to change the file path for `netinfo-mock.js` as it is NOT
 * located at <root>/jest/netinfo-mock.js but inside `node_modules`.
 */
import {NativeModules} from 'react-native';
import RNCNetInfoMock from './node_modules/@react-native-community/netinfo/jest/netinfo-mock.js';

NativeModules.RNCNetInfo = RNCNetInfoMock;

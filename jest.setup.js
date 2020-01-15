import {NativeModules} from 'react-native';
import RNCNetInfoMock from '@react-native-community/netinfo/jest/netinfo-mock.js';
import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';

// Instruction for setting this file up is available at
// https://github.com/react-native-community/react-native-netinfo#errors-while-running-jest-tests
NativeModules.RNCNetInfo = RNCNetInfoMock;

// See mock instruction for async-storage here:
// https://github.com/react-native-community/async-storage/blob/LEGACY/docs/Jest-integration.md
jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);

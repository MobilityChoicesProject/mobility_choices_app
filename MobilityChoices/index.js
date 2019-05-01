/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import { AppRegistry } from 'react-native';
import MobilityChoices from './src/Container/Main/MobilityChoices';
import DebugHelper from './src/Helper/DebugHelper';

// bind debugging functionalities to the console
//if(DebugHelper.isDebugMode()) {
console.alertLog = DebugHelper.alertLog;
//}

AppRegistry.registerComponent('MobilityChoices', () => MobilityChoices);

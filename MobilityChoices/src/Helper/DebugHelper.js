import {Alert, Clipboard} from 'react-native';

export default class DebugHelper {
    static isDebugMode() {
        return __DEV__ === true;
    }

    static alertLog(value) {
        if (DebugHelper.isDebugMode()) {
            var tmpValue = JSON.stringify(value);

            setTimeout(() => {
                Alert.alert("Debug",
                    tmpValue,
                    [
                        {
                            text: 'Copy', onPress: () => {
                                Clipboard.setString(tmpValue);
                            }
                        },
                        {text: 'Cancel', style: 'cancel'},
                        {text: 'OK'},
                    ]);
            }, 1000);
        }
    }
}

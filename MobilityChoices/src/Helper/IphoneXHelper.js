import {Dimensions, Platform} from 'react-native';


export function getHeaderStyle() {

    if (Platform.OS === 'ios') {

        const dim = Dimensions.get('window');

        if (dim.height === 896) {

            return {backgroundColor: '#fff', paddingTop: 30, height: 65};
        } else return {backgroundColor: '#fff'};

    } else return {backgroundColor: '#fff'};

}


export function getFullScreenModalStyle() {

    const dim = Dimensions.get('window');

    if (Platform.OS === 'ios') {

        if (dim.height === 896 || dim.height === 812) {
            // all iphones with a notch 
            return {flex: 1, paddingTop: 20, height: dim.height - 35, width: dim.width - 37};
        }
        //all iphones without a notch
        return {flex: 1, height: dim.height - 35, width: dim.width - 37};

    }
    //all android devices
    else return {flex: 1, height: dim.height - 20, width: dim.width - 37};


}
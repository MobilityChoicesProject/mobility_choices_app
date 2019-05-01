import {Dimensions, StyleSheet} from 'react-native';
import {isIphoneX} from "react-native-iphone-x-helper";

const {width, height} = Dimensions.get('window');
const SCREEN_WIDTH = width;
var SCREEN_HEIGHT = height;

if (isIphoneX()) {
    SCREEN_HEIGHT = SCREEN_HEIGHT - 30;
}

export const styles = StyleSheet.create({
    profileButton: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5
    },
    navigationBar: {
        alignItems: 'center',
        height: 50,
        justifyContent: 'center',
        margin: 5
    },
    preferences: {
        flexGrow: 0,
        margin: 5,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: SCREEN_WIDTH - 60
    },
    preferences_profile: {
        flexGrow: 0,
        margin: 3,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%'

    },
    sliderUmwelt: {
        marginRight: 35,
        marginLeft: 5,
        flex: 1
    },
    sliderGesundheit: {
        marginRight: 17,
        marginLeft: 1,
        flex: 1
    },
    sliderZeit: {
        marginRight: 55,
        flex: 1
    },
    sliderKosten: {
        marginRight: 38,
        flex: 1
    },
    sliderLabel: {
        marginBottom: 5,
        marginLeft: 20,
        fontSize: 16,
        color: '#4e4e4e',
        fontFamily: 'Hind-Bold'
    },
    slider: {
        width: '100%'
    },
    questionSliderLabel: {
        fontSize: 10,
        color: '#8b8b8b',
        fontFamily: 'Hind-Bold'
    },
    questionText: {
        fontSize: 16,
        marginLeft: 60,
        marginRight: 60,
        fontFamily: 'Hind-Medium',
        color: '#8b8b8b'
    },
    questionImage: {
        height: 60,
        width: 60,
        marginTop: 80
    },
    container: {
        height: 470,
        width: 400,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        height: 200,
        width: SCREEN_WIDTH,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    bigMap: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        height: SCREEN_HEIGHT - 70,
        width: SCREEN_WIDTH - 37,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    route: {
        flex: 1,
        alignItems: 'flex-start',
        height: 10
    },
    time: {
        flex: 1,
        alignItems: 'center',
        top: 0
    },
    timeDetails: {
        width: 45,
        alignItems: 'flex-start',
        top: 0,
        justifyContent: 'space-between',
        flexGrow: 1
    },
    transportModes: {
        flex: 1,
        alignItems: 'center',
        top: 0,
        justifyContent: 'center',
    },
    transportModesDetails: {
        flexGrow: 1,
        alignItems: 'flex-start',
        top: 0,
        left: 0,
        justifyContent: 'space-between',
    },
    track: {
        flex: 1,
        flexDirection: 'column'
    },
    trackDetails: {
        flexGrow: 1,
        width: '90%',
        height: 100,
        flexDirection: 'row'
    },
    etrackDetails: {
        flexGrow: 1,
        width: 250,
        height: 175,
        flexDirection: 'row'
    },
    sections: {
        flexDirection: 'row'
    },
    sectionsDetails: {
        flexDirection: 'column',
        margin: 0
    },
    trackData: {
        flexDirection: 'row',
        marginBottom: 15,
        flex: 1
    },
    routeDetails: {
        flexGrow: 1,
        alignItems: 'flex-start',
        width: 20,
    },
    line: {
        backgroundColor: '#4e4e4e',
        width: 2,
        height: 100,
        position: 'absolute',
        left: 7
    },
    eline: {
        backgroundColor: '#4e4e4e',
        width: 2,
        height: 175,
        position: 'absolute',
        left: 7
    },
    circle: {
        height: 18,
        width: 18,
        borderRadius: 9,
        position: 'absolute',
        backgroundColor: '#FFF',
        borderColor: '#4e4e4e',
        borderWidth: 2,
        left: 0,
        bottom: 0
    },
    circleEnd: {
        height: 18,
        width: 18,
        borderRadius: 9,
        position: 'absolute',
        backgroundColor: '#FFF',
        borderColor: '#4e4e4e',
        borderWidth: 2,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    circleDetails: {
        height: 18,
        width: 18,
        borderRadius: 9,
        position: 'absolute',
        backgroundColor: '#fff',
        borderColor: '#4e4e4e',
        borderWidth: 2,
        left: 0,
        top: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    circleEndDetails: {
        height: 18,
        width: 18,
        borderRadius: 9,
        position: 'absolute',
        backgroundColor: '#fff',
        borderColor: '#4e4e4e',
        borderWidth: 2,
        left: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    blackInnerCircle: {
        height: 9,
        width: 9,
        borderRadius: 9,
        backgroundColor: '#4e4e4e',
        borderColor: '#4e4e4e',
        borderWidth: 2,
        left: 0,
        bottom: 0
    },
    blueInnerCircle: {
        height: 9,
        width: 9,
        borderRadius: 9,
        backgroundColor: '#78D1C0',
        borderColor: '#78D1C0',
        borderWidth: 2,
        left: 0,
        top: 0
    },
    evaluation: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        marginTop: 28,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 20
    },
    evaluationItem: {
        justifyContent: 'space-between',
        flexDirection: 'column',
        alignItems: 'center'
    },
    edittransports: {
        width: 170,
        flexGrow: 0,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#e0eeee'
    },
    modalContent: {
        backgroundColor: "white",
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)'
    },
    modalbutton1: {
        backgroundColor: '#78D1C0',
        height: 35,
        alignSelf: 'stretch',
        borderRadius: 50,
        margin: 10,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: "rgba(0, 0, 0, 0.1)"
    },
    modalbutton2: {
        backgroundColor: '#b3bbbb',
        height: 35,
        alignSelf: 'stretch',
        borderRadius: 50,
        margin: 10,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'rgba(0, 0, 0, 0.1)'
    },
    splitline: {
        backgroundColor: '#333',
        width: 2,
        height: 100,
        position: 'absolute',
        left: 12
    },
    SplitIconEnd: {
        flexGrow: 0,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 25,
        position: 'absolute',
        bottom: 0,
    },
    standardViewStyle: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'white'
    },
    privacyPolicyHeading: {
        fontSize: 16,
        fontFamily: 'Hind-Bold',
        color: '#4e4e4e'
    },
    privacyPolicyText: {
        fontSize: 14,
        fontFamily: 'Hind-Medium',
        color: '#4e4e4e'
    },
    privacyPolicyTextBold: {
        fontSize: 14,
        fontFamily: 'Hind-Bold',
        color: '#4e4e4e'
    },
    blueButtonCenter: {
        marginBottom: 10,
        backgroundColor: '#78D1C0',
        height: 35,
        width: '97%',
        alignSelf: 'center'
    },
    blueButton: {
        marginBottom: 10,
        backgroundColor: '#78D1C0',
        height: 35
    },
    Button80: {
        marginBottom: 10,
        backgroundColor: '#78D1C0',
        height: 35,
        width: '80%',
        alignSelf: 'center'
    },
    saveButton: {
        marginBottom: 10,
        backgroundColor: '#78D1C0',
        height: 35,
        width: '90%'
    },
    blueButtonSmall: {
        marginBottom: 15,
        marginTop: 15,
        marginLeft: '70%',
        backgroundColor: '#78D1C0',
        height: 35,
        width: 100
    },
    orangeButton: {
        marginBottom: 10,
        backgroundColor: '#FFC200',
        height: 35
    },
    pinkButton: {
        marginBottom: 10,
        backgroundColor: '#FF5F7C',
        height: 35
    },
    greenButton: {
        marginBottom: 10,
        backgroundColor: '#B0CE00',
        height: 35
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontFamily: 'Hind-Regular',
        alignSelf: 'center', /* alignSelf, textAlign and fontSize are required to align the text in the center of the text field. Especially on iOS. */
        textAlign: 'center',
        fontSize: 13
    },
    buttonTextDark: {
        color: '#3f3f3f',
        fontWeight: 'bold',
        fontFamily: 'Hind-Regular',
        alignSelf: 'center', /* alignSelf, textAlign and fontSize are required to align the text in the center of the text field. Especially on iOS. */
        textAlign: 'center',
        fontSize: 13
    },
    labelPlanRoute: {
        fontSize: 10,
        marginTop: 10,
        color: '#4e4e4e',
        fontFamily: 'Hind-SemiBold'
    },
    labelProfile: {
        fontSize: 12,
        marginTop: 5,
        marginRight: 5,
        color: '#000',
        fontFamily: 'Hind-Regular'
    },
    icons: {
        fontSize: 24,
        color: '#4e4e4e',
        marginBottom: 5
    },

    listItem: {
        backgroundColor: 'white',
        borderTopColor: '#838B8B',
        borderTopWidth: 1
    },
    listItemAllTracks: {
        backgroundColor: '#b3bbbb',
        height: 15,
        marginBottom: 10
    },
    headingsAllTracks: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: 'Hind-Regular'
    },
    labelText: {
        color: '#4e4e4e',
        fontSize: 10,
        fontFamily: 'Hind-SemiBold'

    },
    labelTextUserProfile: {
        color: '#4e4e4e',
        fontSize: 10,
        fontFamily: 'Hind-SemiBold',
        width: 60,
        marginRight: 7

    },
    profileHeadings: {
        color: '#8b8b8b',
        fontFamily: 'Hind-SemiBold',
        fontSize: 10
    },
    checkBoxLabel: {
        fontFamily: 'Hind-SemiBold',
        fontSize: 14,
        color: '#4e4e4e'
    },
    tresholdLabel: {
        fontFamily: 'Hind-SemiBold',
        fontSize: 10,
        flex: 0.7,
        color: "#4e4e4e"
    }
});

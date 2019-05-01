import React, {Component} from 'react';
import {AsyncStorage} from 'react-native';
import {StackNavigator} from 'react-navigation';
import {Root} from 'native-base'
import FCM, {
    FCMEvent,
    NotificationType,
    RemoteNotificationResult,
    WillPresentNotificationResult
} from 'react-native-firebase';
import BackgroundGeolocation from "react-native-background-geolocation";

import LoginScreen from '../Login/LoginScreen';
import RegisterScreen from '../Register/RegisterScreen';
import Dashboard from '../Dashboard/Dashboard';
import ProfileScreen from '../Profile/ProfileScreen';
import AllTracksScreen from '../AllTracks/AllTracksScreen';
import PlanRouteScreen from '../PlanRoute/PlanRouteScreen';
import TmdTrackDetails from '../AllTracks/Details/TmdTrackDetails';
import FinalTrackDetails from '../AllTracks/Details/FinalTrackDetails';
import RouteDetails from '../PlanRoute/RouteDetails';
import Start from '../Register/Questions/Start';
import Time from '../Register/Questions/Time';
import Costs from '../Register/Questions/Costs';
import Environment from '../Register/Questions/Environment';
import Health from '../Register/Questions/Health';
import Finish from '../Register/Questions/Finish';
import RealmAPI from '../../Lib/RealmAPI';
import PrivacyPolicyScreen from '../InfoScreens/PrivacyPolicy';
import AppNoticeScreen from '../InfoScreens/AppNotice';
import AcceptScreen from '../Register/AcceptPrivacyPolicy';
import PasswordForgottenScreen from '../PasswordScreens/PasswordForgottenScreen';
import PasswordChangeScreen from '../PasswordScreens/PasswortChangeScreen';
import TrackDetailScreen from '../AllTracks/Details/TrackDetail';
import {fromJS} from 'immutable';

const MyNavigator = StackNavigator({
    Login: {screen: LoginScreen},
    Dashboard: {screen: Dashboard},
    Register: {screen: RegisterScreen},
    Profile: {screen: ProfileScreen},
    PlanRoute: {screen: PlanRouteScreen},
    AllTracks: {screen: AllTracksScreen},
    FinalDetails: {screen: FinalTrackDetails},
    RouteDetails: {screen: RouteDetails},
    TmdTrackDetails: {screen: TmdTrackDetails},
    Start: {screen: Start},
    Time: {screen: Time},
    Costs: {screen: Costs},
    Environment: {screen: Environment},
    Health: {screen: Health},
    Finish: {screen: Finish},
    PrivacyPolicy: {screen: PrivacyPolicyScreen},
    AppNotice: {screen: AppNoticeScreen},
    ForgotPassword: {screen: PasswordForgottenScreen},
    PasswordChange: {screen: PasswordChangeScreen},
    AcceptPrivacyPolicy: {screen: AcceptScreen},
    TrackDetail: {screen: TrackDetailScreen}
});

const TRACKING_DURATION = 1000 * 60 * 60 * 20; // ms * s * m * h // 20 hours

export default class MobilityChoices extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeScreen: 'login',
            locationPermissionGranted: false,
            track: '',
            tracking: false
        }
    }

    trackingTimerStartTime = null;

    render() {
        return (
            <Root>
                <MyNavigator screenProps={this}/>
            </Root>
        );
    }

    componentWillMount() {
        this.requestLocationPermission();

        FCM.messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                    console.log("Permission:" + FCM.messaging().getToken().toString());
                } else {
                    FCM.messaging().requestPermission()
                        .then(() => {
                            console.log("Got New Permissions")
                        })
                        .catch(error => {
                            console.log("life is a bitch")
                        });
                }
            });

        this.refreshTokenListener = FCM.messaging().onTokenRefresh((token) => {
            // fcm token may not be available on first load, catch it here
            try {
                AsyncStorage.setItem('@MyStorage:pushToken', token);
            } catch (error) {
                // Error saving data
            }
        });

        this.notificationListener = FCM.messaging().onMessage((notif) => {
            // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
            if (notif.local_notification) {
                //this is a local notification
            }
            if (notif.opened_from_tray) {
                //app is open/resumed because user clicked banner
            }
        });
        this.refreshTokenListener = FCM.messaging().onTokenRefresh((token) => {
            // fcm token may not be available on first load, catch it here
            try {
                AsyncStorage.setItem('@MyStorage:pushToken', token);
            } catch (error) {
                // Error saving data
            }
        });
    }

    componentWillUnmount() {
        // stop listening for events
        // https://stackoverflow.com/questions/47935377/react-native-firebasehow-can-i-remove-onmessage-exist-event
        // https://rnfirebase.io/docs/v3.2.x/messaging/reference/messaging#onMessage
        this.notificationListener();
        this.refreshTokenListener();

        //stop all the backgroundgeolocation listeners at once
        BackgroundGeolocation.removeListeners();
    }

    configureLocationService() {
        /*
         1.  Wire up event-listeners
        */
        // This handler fires whenever bgGeo receives a location update.
        BackgroundGeolocation.on('location', this.onLocation, this.onLocationError);

        // This handler fires whenever bgGeo receives an error
        BackgroundGeolocation.on('error', this.onError);

        // This handler fires when movement states changes (stationary->moving; moving->stationary)
        BackgroundGeolocation.on('motionchange', this.onMotionChange);

        // This event fires when a change in motion activity is detected
        BackgroundGeolocation.on('activitychange', this.onActivityChange);

        // This event fires when the user toggles location-services
        BackgroundGeolocation.on('providerchange', this.onProviderChange);


        /*
          2.  #configure the plugin (just once for life-time of app)
        */
        BackgroundGeolocation.configure({
            // Geolocation Config
            desiredAccuracy: 0,                 //Specify the desired-accuracy of the geolocation system
            distanceFilter: 0,                  //The minimum distance (measured in meters) a device must move horizontally before an update event is generated.
            disableElasticity: true,            //Set true to disable automatic speed-based #distanceFilter elasticity.
            // Geolocation Android
            locationUpdateInterval: 900,        //Sets the desired interval for location updates, in milliseconds.
            fastestLocationUpdateInterval: 900, //Explicitly set the fastest interval for location updates, in milliseconds.
            allowIdenticalLocations: true,      //Set true to record every location, regardless if it is identical to the last location.
            // Geolocation iOS
            stationaryRadius: 1,                //When stopped, the minimum distance the device must move beyond the stationary location for aggressive background-tracking to engage.
            // Activity Recognition
            activityRecognitionInterval: 0,     //A value of 0 will result in activity detections at the fastest possible rate.
            stopTimeout: 500,                   //The number of minutes to wait before turning off location-services after the ActivityRecognition System (ARS) detects the device is STILL
            stopDetectionDelay: 500,            //Number of minute to delay the stop-detection system from being activated.
            //Application
            stopOnTerminate: false,             //Set false to continue tracking after user teminates the app.
            startOnBoot: false,                 //Set to true to enable background-tracking after the device reboots.
            heartbeatInterval: 10,              //Rate in seconds to fire heartbeat events.,
            //Android
            foregroundService: true,            //Set true to make the plugin mostly immune to OS termination due to memory pressure from other apps.
            notificationTitle: 'MobilityChoices',
            notificationText: 'Weg wird aufgezeichnet...',
            //iOS
            preventSuspend: true,               //Enable this to prevent iOS from suspending your app in the background while in the stationary state. Must be used in conjunction with a #heartbeatInterval

            //Debug
            debug: false,                       //When enabled, the plugin will emit sounds & notifications for life-cycle events of background-geolocation
            logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE
        }, (state) => {
            if (!state.enabled) {
                /*
                 3. Ready to start tracking!
                */
            }
        });

    }

    onLocation = (location) => {
        if (this.shouldTheTrackingTimerBeExecuted()) {
            this.stopTracking();

            return;
        }

        // the track cannot be null or undefined
        if (this.state.track) {
            var coords = location.coords;
            var activity = location.activity;
            var timestamp = new Date().getTime();

            var currentdate = new Date();
            this.saveAccuray("" + coords.accuracy, JSON.stringify(currentdate));

            RealmAPI.savePosition(this.state.track, timestamp, {
                accuracy: coords.accuracy,
                latitude: coords.latitude,
                longitude: coords.longitude,
                speed: coords.speed,
                altitude: coords.altitude,
                confidence: activity.confidence,
                type: activity.type
            });
        }
    }

    async saveAccuray(accuracy, date) {
        try {
            await AsyncStorage.setItem('@MyStorage:accuracy', accuracy);
            await AsyncStorage.setItem('@MyStorage:accuracydate', date);
        } catch (error) {
            console.log("Error saving data" + error);
        }
    }

    onError(error) {
        //console.warn('[ERROR] BackgroundGeolocation error:', error);
    }

    onActivityChange(activity) {
        //console.log('- [event] activitychange: ', activity);  // eg: 'on_foot', 'still', 'in_vehicle'
    }

    onProviderChange(provider) {
        //console.log('- [event] providerchange: ', provider);
    }

    onMotionChange(location) {
        //console.log('- [event] motionchange: ', location.isMoving, location);
    }

    trackingState() {
        return new Promise(function (resolve, reject) {
            BackgroundGeolocation.getState(function (state) {
                resolve(state);
            });
        });
    }

    getTrack() {
        return this.state.track;
    }

    startTracking(track) {
        this.setState({
            track: track,
            tracking: true
        });
        BackgroundGeolocation.start(function (state) {
            BackgroundGeolocation.changePace(true);
        });
    }

    cancelTracking() {
        this.stopTrackingTimer();
        RealmAPI.deleteTrackById(this.state.track);

        this.setState({
            tracking: false,
            track: null
        });

        BackgroundGeolocation.stop();
    }

    async stopTracking() {
        this.stopTrackingTimer();
        BackgroundGeolocation.stop();
        this.setState({
            tracking: false
        });
        await RealmAPI.trackDidSuccessfullyStop(this.state.track);
    }

    async getLocationCountForCurrentTracking() {
        var response = await RealmAPI.loadLocations(this.getTrack());
        posCount = Object.keys(response.data).length;
        return posCount;
    }

    async canTrackingSuccessfullyStop() {
        var count = await this.getLocationCountForCurrentTracking();
        return count >= 100;
    }

    startTrackingTimer() {
        this.trackingTimerStartTime = new Date();
    }

    stopTrackingTimer() {
        this.trackingTimerStartTime = null;
    }

    shouldTheTrackingTimerBeExecuted() {
        return this.trackingTimerStartTime && (new Date().getTime()) - this.trackingTimerStartTime.getTime() >= TRACKING_DURATION;
    }

    isPermissionGranted(response) {
        var permitted = false;
        if (response == 'authorized') {
            permitted = true;
        }
        return permitted;
    }

    async requestLocationPermission() {
        this.configureLocationService()
    }
}

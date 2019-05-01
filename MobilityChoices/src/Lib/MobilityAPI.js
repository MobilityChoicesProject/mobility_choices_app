import axios from 'axios';
import RealmAPI from '../Lib/RealmAPI';
import ObjectHelper from '../Helper/ObjectHelper';
import MobilityAPIHelper from '../Helper/MobilityAPIHelper';
import FCM, {
    FCMEvent,
    NotificationType,
    RemoteNotificationResult,
    WillPresentNotificationResult
} from 'react-native-firebase';
import Keys from "./Keys";

const SERVER_URL = Keys.getServerURL();


const COMMON_HEADERS = {
    'Content-Type': 'application/json'
};

export default class MobilityAPI {
    static async login(email, password) {
        try {
            var response = await axios.request({
                method: 'POST',
                headers: COMMON_HEADERS,
                url: SERVER_URL + '/MobilityUsers/login',
                data: {
                    email: email,
                    password: password
                }
            });

            var data = response.data;
            var authToken = data.id;
            await RealmAPI.saveLoginData(data.userId, email, authToken, data.ttl, data.created);

            return {success: true, data: response.data};
        } catch (error) {
            return {success: false, error: "login_failed"};
        }
    }

    static async logout() {
        var loginData = RealmAPI.getLoginData();

        if (loginData) {
            try {
                await axios.request({
                    method: 'POST',
                    headers: COMMON_HEADERS,
                    url: SERVER_URL + '/MobilityUsers/logout?' + MobilityAPIHelper.buildAccessTokenParameter(loginData.authToken)
                });
            } catch (error) {
            }

            await RealmAPI.clearLoginData();
            return true;
        }

        return false;
    }

    static async checkLogin() {
        var loginData = RealmAPI.getLoginData();

        // The ttl is in seconds, but the getTime() method returns milliseconds.
        // Therefore we have to multiply the ttl by 1000.
        if (loginData && loginData.authToken && new Date().getTime() < (loginData.created.getTime() + loginData.ttl * 1000)) {
            return true;
        }

        return false;
    }

    static async register(email, password) {
        try {
            var response = await axios.request({
                method: 'POST',
                headers: COMMON_HEADERS,
                url: SERVER_URL + '/MobilityUsers',
                data: {
                    email: email,
                    password: password
                }
            });

            return {success: true, data: response.data};
        } catch (error) {
            return {success: false, error: error};
        }
    }

    static async resetPassword(email) {
        try {
            var response = await axios.request({
                method: 'POST',
                header: COMMON_HEADERS,
                url: SERVER_URL + '/MobilityUsers/reset',
                data: {
                    email: email
                }
            });
            return {success: true, data: response.data};
        } catch (error) {
            return {success: false, error: error};
        }
    }

    static async changePassword(oldPwd, newPwd) {
        var loginData = RealmAPI.getLoginData();

        if (loginData) {
            try {
                var response = await axios.request({

                    method: 'POST',
                    headers: COMMON_HEADERS,
                    url: SERVER_URL + '/MobilityUsers/change-password?' + MobilityAPIHelper.buildAccessTokenParameter(loginData.authToken),
                    data: {
                        oldPassword: oldPwd,
                        newPassword: newPwd

                    }
                });
                return {success: true, data: response.data};
            } catch (error) {
                return {success: false, error: error};
            }
        }
    }

    static async uploadTrack(trajectory, name, date) {
        var loginData = RealmAPI.getLoginData();

        if (loginData) {
            try {
                var fcmPushToken = await FCM.messaging().getToken();

                var response = await axios.request({
                    timeout: 600000,
                    method: 'POST',
                    headers: COMMON_HEADERS,
                    url: SERVER_URL + '/tmd?' + MobilityAPIHelper.buildAccessTokenParameter(loginData.authToken) + '&push_token=' + encodeURIComponent(fcmPushToken),
                    data: {
                        UserID: loginData.userId,
                        date: date.toString(),
                        trajectory: trajectory,
                        name: name
                    }
                });

                if (response.data.status === "ok") {
                    return {success: true, message: response.data.message};
                } else {
                    return {success: false, error: response.data.error};
                }
            } catch (error) {
                return {success: false, error: error};
            }
        }

        return {success: false, error: "not_logged_in"};
    }

    static async updateFinalTMDTrack(track, deletedByClient, approved) {
        var loginData = RealmAPI.getLoginData();
        if (loginData) {
            try {
                var response;
                if (deletedByClient) {
                    response = await axios.request({
                        method: 'POST',
                        headers: COMMON_HEADERS,
                        url: SERVER_URL + '/deleteTrack',
                        data: {
                            trackId: track.id,
                            accessToken: loginData.authToken
                        }
                    });

                    return {success: true, data: response.data};
                } else {    //alte delete bzw. update funktion
                    // We would like to avoid the copy, but we require this to convert the realm list objects into proper arrays so that we can convert them to proper json arrays!!!
                    var dataToSend = await ObjectHelper.deepCopyRealm({}, track);

                    dataToSend.deletedByClient = deletedByClient;
                    dataToSend.approved = approved;

                    //In dieser Funktion sollte der bearbeitete Track an den Server geschickt werden
                    response = await axios.request({
                        method: 'POST',
                        headers: COMMON_HEADERS,
                        url: SERVER_URL + '/editTrack',
                        data: {
                            track: dataToSend,
                            accessToken: loginData.authToken
                        }
                    });

                    return {success: true, data: response.data};
                }
            } catch (error) {
                return {success: false, error: error};
            }
        }

        return {success: false, error: null};
    }

    static async publish(track) {
        var loginData = RealmAPI.getLoginData();
        var dataToSend = await ObjectHelper.deepCopyRealm({}, track);
        dataToSend.approved = true;
        if (loginData) {
            try {
                var fcmPushToken = await FCM.messaging().getToken();
                var response = await axios.request({
                    timeout: 600000,
                    method: 'POST',
                    headers: COMMON_HEADERS,
                    url: SERVER_URL + '/publish',
                    data: {
                        track: dataToSend,
                        accessToken: loginData.authToken,
                        pushToken: fcmPushToken
                    }
                });
                if (response.data.status === "ok") {
                    return {success: true, data: response.data};
                } else {
                    return {success: false};
                }
            } catch (error) {
                return {success: false, error: error};
            }
        }
    }

    static async refreshTMDTracks(hashArray) {
        var loginData = RealmAPI.getLoginData();

        if (loginData) {
            try {
                var response = await axios.request({
                    method: 'POST',
                    headers: COMMON_HEADERS,
                    url: SERVER_URL + '/checkTracks',
                    data: {"email": loginData.email, "hashArray": hashArray}
                });

                return {success: true, data: response.data.tracks};
            } catch (error) {
                return {success: false, error: error};
            }
        } else {
            return {success: false, error: null};
        }
    }

    static async getTMDTracks(notReleasedTracks) {
        var loginData = RealmAPI.getLoginData();

        if (loginData) {
            try {

                if (notReleasedTracks) {

                    var response = await axios.request({
                        method: 'GET',
                        headers: COMMON_HEADERS,
                        url: SERVER_URL + '/MobilityUsers/' + encodeURIComponent(loginData.userId) + '/tracks?' + MobilityAPIHelper.buildAccessTokenParameter(loginData.authToken) + '&filter={' +
                            '"where":{' +
                            '"and":[' +
                            '{"deletedByClient":false}' +
                            ',{"approved":false}' +
                            ']' +
                            '}' +
                            '}'
                    });
                } else {
                    //In dieser Methode sollten alle auf dem Server gespeicherten TMD Tracks zurückgegeben werden
                    var response = await axios.request({
                        method: 'GET',
                        headers: COMMON_HEADERS,
                        url: SERVER_URL + '/MobilityUsers/' + encodeURIComponent(loginData.userId) + '/tracks?' + MobilityAPIHelper.buildAccessTokenParameter(loginData.authToken) + '&filter={' +
                            '"where":{' +
                            '"and":[' +
                            '{"deletedByClient":false}' +
                            ']' +
                            '}' +
                            '}'
                    });
                }
                return {success: true, data: response.data};
            } catch (error) {
                return {success: false, error: error};
            }

        }

        return {success: false, error: null};
    }

    static async getTMDTrack(id) {
        var loginData = RealmAPI.getLoginData();

        if (loginData) {
            try {
                //In dieser Methode sollten alle auf dem Server gespeicherten TMD Tracks zurückgegeben werden
                var response = await axios.request({
                    method: 'GET',
                    headers: COMMON_HEADERS,
                    url: SERVER_URL + '/MobilityUsers/' + encodeURIComponent(loginData.userId) + '/tracks/' + encodeURIComponent(id) + '?' + MobilityAPIHelper.buildAccessTokenParameter(loginData.authToken) + '&filter={"where":{"deletedByClient":false}}'
                });

                return {success: true, data: response.data};
            } catch (error) {
                return {success: false, error: error};
            }
        }

        return {success: false, error: null};
    }

    static async getDirections(from, to, date, via) {
        var loginData = RealmAPI.getLoginData();

        if (loginData) {
            var url;
            if (via === '') {
                url = SERVER_URL + '/directions?from='
                    + encodeURIComponent(from.lat) + ',' + encodeURIComponent(from.lng) +
                    '&to=' + encodeURIComponent(to.lat) + ',' + encodeURIComponent(to.lng) +
                    '&depTime=' + encodeURIComponent(date) +
                    '&' + MobilityAPIHelper.buildAccessTokenParameter(loginData.authToken);
            } else {
                url = SERVER_URL + '/directions?from='
                    + encodeURIComponent(from.lat) + ',' + encodeURIComponent(from.lng) +
                    '&to=' + encodeURIComponent(to.lat) + ',' + encodeURIComponent(to.lng) +
                    '&via=' + encodeURIComponent(via.lat) + ',' + encodeURIComponent(via.lng) +
                    '&depTime=' + encodeURIComponent(date) +
                    '&' + MobilityAPIHelper.buildAccessTokenParameter(loginData.authToken);
            }

            try {
                var response = await axios.request({
                    method: 'GET',
                    headers: COMMON_HEADERS,
                    url: url
                });

                return {success: true, data: response.data};
            } catch (error) {
                return {success: false, error: error};
            }
        }
    }

    static async getUserGroupsForUser() {
        var loginData = RealmAPI.getLoginData();

        if (loginData) {
            try {
                var response = await axios.request({
                    method: 'GET',
                    headers: COMMON_HEADERS,
                    url: SERVER_URL + '/getUsergroups?userid=' + encodeURIComponent(loginData.userId),
                });
                return {success: true, data: response.data};
            } catch (error) {
                return {success: false, error: error};
            }
        }
    }


    static async updateUserGroupsForUser(userGroupsForUser) {
        var loginData = RealmAPI.getLoginData();

        if (loginData) {
            try {
                var response = await axios.request({
                    method: 'POST',
                    headers: COMMON_HEADERS,
                    url: SERVER_URL + '/updateUsergroups?userid=' + encodeURIComponent(loginData.userId),
                    data: {
                        data: userGroupsForUser,
                    }
                });
                return {success: true, data: response.data};
            } catch (error) {
                return {success: false, error: error};
            }
        }
    }

    static async updateProfile(profile) {
        var loginData = RealmAPI.getLoginData();

        if (loginData) {
            try {
                var response = await axios.request({
                    method: 'PUT',
                    headers: COMMON_HEADERS,
                    url: SERVER_URL + '/MobilityUsers/' + encodeURIComponent(loginData.userId) + '/profile?' + MobilityAPIHelper.buildAccessTokenParameter(loginData.authToken),
                    data: profile
                });

                return {success: true, data: MobilityAPIHelper.copyProfileResponse(profile, response)};
            } catch (error) {
                return {success: false, error: error};
            }
        }
        return {success: false, error: null};
    }

    static async createProfile(profile, email) {
        var loginData = RealmAPI.getLoginData();

        if (loginData) {
            try {
                var response = await axios.request({
                    method: 'POST',
                    headers: COMMON_HEADERS,
                    url: SERVER_URL + '/MobilityUsers/' + encodeURIComponent(loginData.userId) + '/profile?' + MobilityAPIHelper.buildAccessTokenParameter(loginData.authToken),
                    data: {
                        alreadySynced: profile.alreadySynced,
                        bike: profile.bike,
                        bus: profile.bus,
                        car: profile.car,
                        carType: profile.carType,
                        costValue: profile.costValue,
                        city: profile.city,
                        ebike: profile.ebike,
                        ecar: profile.ecar,
                        ecarType: profile.ecarType,
                        email: email,
                        envValue: profile.envValue,
                        ewastage: profile.ewastage,
                        healthValue: profile.healthValue,
                        motorbike: profile.motorbike,
                        timeValue: profile.timeValue,
                        train: profile.train,
                        wastage: profile.wastage,
                        profile: loginData.userId,
                        registerDate: profile.registerDate
                    }
                });

                return {success: true, data: MobilityAPIHelper.copyProfileResponse(profile, response)};
            } catch (error) {
                return {success: false, error: error};
            }
        }

        return {success: false, error: null};
    }

    static async loadProfile() {
        var loginData = RealmAPI.getLoginData();

        if (loginData) {
            try {
                var response = await axios.request({
                    method: 'GET',
                    headers: COMMON_HEADERS,
                    url: SERVER_URL + '/MobilityUsers/' + encodeURIComponent(loginData.userId) + '/profile?' + MobilityAPIHelper.buildAccessTokenParameter(loginData.authToken)
                });

                return {success: true, data: response.data};
            } catch (error) {
                return {success: false, error: error};
            }
        }

        return {success: false, error: null};
    }

    static async splitTrack(tmdtrack) {
        try {
            var loginData = RealmAPI.getLoginData();
            var response = await axios.request({
                method: 'POST',
                headers: COMMON_HEADERS,
                url: SERVER_URL + '/tracksplitter',
                data: {
                    track: tmdtrack,
                    mobilityUserId: loginData.userId,
                    access_token: loginData.authToken
                }
            });

            var data = response.data;
            if (response.data.status == "ok") {
                return {success: true};
            } else {
                return {success: false};
            }
        } catch (error) {
            return {success: false, error: error};
        }
    }


    static async saveFirebaseToken(firebaseToken) {
        var loginData = RealmAPI.getLoginData();
        if (loginData) {
            try {
                var response = await axios.request({
                    method: 'POST',
                    headers: COMMON_HEADERS,
                    url: SERVER_URL + '/saveFirebaseToken?' + MobilityAPIHelper.buildAccessTokenParameter(loginData.authToken),
                    data: {
                        firebaseToken: firebaseToken
                    }
                });
                if (response.data.status === "ok") {
                    return {success: true, data: response.data};
                } else {
                    return {success: false};
                }
            } catch (error) {
                return {success: false, error: error};
            }
        }
    }

}

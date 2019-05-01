import {realm} from './RealmModel';

const LOGIN_DATA = 'LoginData';
const PROFILE = 'Profile';
const TRACK_DATA = 'Trackdata';
const TRACK = 'Track';
const TMD_TRACK = 'TmdTrack';
const USERGROUPS = 'UserGroups';

export default class RealmAPI {
    static async saveLoginData(userId, email, authToken, ttl, created) {
        await RealmAPI.clearLoginData();

        var loginData = await RealmAPI._write(() => {
            return realm.create(LOGIN_DATA, {
                userId: userId,
                email: email,
                created: created,
                authToken: authToken,
                ttl: ttl
            }, true);
        });

        return {success: true, data: loginData};
    }

    static async clearLoginData() {
        await RealmAPI._write(async () => {
            var all = realm.objects(LOGIN_DATA);
            await realm.delete(all);
        });

        return true;
    }

    static getLoginData() {
        var loginData = realm.objects(LOGIN_DATA);

        if (loginData.length > 0) {
            return loginData[0];
        }

        return null;
    }

    static async createOrUpdateProfile(profile) {
        var myProfile = await RealmAPI._write(() => {
            var myNewProfile = profile;
            myNewProfile.age = parseInt(profile.age);
            myNewProfile.bikeThreshold = parseFloat(profile.bikeThreshold);
            myNewProfile.footThreshold = parseFloat(profile.footThreshold);
            myNewProfile.changeTrainThreshold = parseFloat(profile.changeTrainThreshold);
            myNewProfile.waitingTimeThreshold = parseFloat(profile.waitingTimeThreshold);
            myNewProfile.footToStationThreshold = parseFloat(profile.footToStationThreshold);
            myNewProfile.bikeToStationThreshold = parseFloat(profile.bikeToStationThreshold);
            myNewProfile.AcceptPrivacyPolicy = profile.AcceptPrivacyPolicy;
            return realm.create(PROFILE, myNewProfile, true);
        });

        return {success: true, data: myProfile};
    }

    static async createDefaultProfile(email, country, gender, age, city) {
        var myProfile = await RealmAPI._write(() => {
            let today = new Date();

            return realm.create(PROFILE, {
                email: email,
                healthValue: 0,
                envValue: 0,
                timeValue: 0,
                costValue: 0,
                bike: true,
                ebike: true,
                train: true,
                bus: true,
                motorbike: true,
                car: true,
                ecar: true,
                carType: 'small',
                ecarType: 'Esmall',
                wastage: '8.1',
                ewastage: '8.1',
                country: country,
                city: city,
                age: parseInt(age),
                gender: gender,
                bikeThreshold: 12.0,
                footThreshold: 5.0,
                changeTrainThreshold: 5.0,
                waitingTimeThreshold: 30.0,
                footToStationThreshold: 3.0,
                bikeToStationThreshold: 7.0,
                registerDate: today,
                AcceptPrivacyPolicy: true
            }, true);
        });
        return {success: true, data: myProfile};
    }

    static async loadUserCountry() {
        var loginData = RealmAPI.getLoginData();
        var profile = await RealmAPI.loadProfile(loginData.email);
        var country = profile.data.country;
        return country;
    }

    static async findHighestPriorities(email) {
        var profiles = realm.objects(PROFILE).filtered('email == $0', email);
        var myProfile = profiles[0];
        var profilesTest = realm.objects(PROFILE);
        var myProfile = profilesTest[0];
        var preferences = {
            cost: myProfile.costValue,
            health: myProfile.healthValue,
            env: myProfile.envValue,
            time: myProfile.timeValue
        };
        var sortable = [];

        for (var key in preferences) {
            if (preferences.hasOwnProperty(key)) {
                sortable.push([key, preferences[key]]); // each item is an array in format [key, value]
            }
        }

        // sort items by value
        sortable.sort(function (a, b) {
            return b[1] - a[1]; // compare numbers
        });

        var result = [];
        result[0] = sortable[0];
        result[1] = sortable[1];

        return {success: true, data: result};
    }

    static async loadProfile(email) {
        var profiles = realm.objects(PROFILE).filtered('email == $0', email);

        if (profiles.length > 0) {
            return {success: true, data: profiles[0]};
        }

        return {success: false, error: "load_failed"};
    }

    static async createTrack(email, timestamp) {
        var tracks = realm.objects(TRACK);
        var nextID = '' + (tracks.length + 1);
        var trackName = "Track " + nextID;

        await RealmAPI._write(() => {
            var myTrack = realm.create(TRACK, {
                email: email,
                id: nextID,
                isTracking: true,
                isAnalyzing: false,
                name: trackName,
                date: timestamp,
                reason: 'default'
            }, true);
        });

        return {success: true, data: nextID};
    }

    static async deleteTrackById(trackId) {
        var locations = realm.objects(TRACK_DATA).filtered('id == $0', trackId);
        var tracks = realm.objects(TRACK).filtered('id == $0', trackId);

        await Promise.all([
            RealmAPI._write(() => {
                realm.delete(locations);
            }),
            RealmAPI._write(() => {
                realm.delete(tracks);
            }),
        ]);

        return true;
    }

    static async deleteTrack(track) {
        return await RealmAPI.deleteTrackById(track.id);
    }

    static async deleteAllTmdTracks() {
        var tracks = realm.objects(TMD_TRACK);

        await RealmAPI._write(() => {
            realm.delete(tracks);
        });

        return true;
    }

    static async deleteTmdTrack(track) {
        var tracks = realm.objects(TMD_TRACK).filtered('id == $0', track.id);

        if (tracks.length > 0) {
            var track = tracks[0];

            //for each section
            var sections = track.sections;
            var tasks = [];

            for (var i in sections) {
                var section = sections[i];
                var probabilities = section.probabilities;
                var coordinates = section.coordinates;

                tasks.push(() => {
                    realm.delete(probabilities);
                    realm.delete(coordinates);
                });
            }

            // use only one realm transaction, to improve the performance
            await RealmAPI._write(() => {
                // execute all tasks in a single transaction
                for (var i in tasks) {
                    tasks[i]();
                }

                var sections = track.sections;
                realm.delete(sections);
                realm.delete(track);
            });
        }
    }

    static async savePosition(id, timestamp, coords) {
        var myTrack = await RealmAPI._write(() => {
            return realm.create(TRACK_DATA, {
                id: id,
                accuracy: coords.accuracy,
                latitude: coords.latitude,
                longitude: coords.longitude,
                altitude: coords.altitude,
                timestamp: timestamp,
                confidence: coords.confidence,
                type: coords.type,
                speed: coords.speed
            }, true);
        });

        return {success: true, data: myTrack};
    }

    static async setTrackAnalyzation(trackId, isAnalyzing) {
        var result = await RealmAPI.loadTrackById(trackId);

        if (result.success) {
            var track = result.data;

            await RealmAPI._write(() => {
                track.isAnalyzing = isAnalyzing;
            });

            return {success: true, data: track};
        }

        return {success: false, data: null};
    }

    static async trackDidSuccessfullyStop(trackId) {
        var result = await RealmAPI.loadTrackById(trackId);

        if (result.success) {
            var track = result.data;

            await RealmAPI._write(() => {
                track.isTracking = false;
            });

            return {success: true, data: track};
        }

        return {success: false, data: null};
    }

    static async updateTrack(trackId, trackName) {
        var result = await RealmAPI.loadTrackById(trackId);

        if (result.success) {
            var track = result.data;

            await RealmAPI._write(() => {
                track.name = trackName;
            });

            return {success: true, data: track};
        }

        return {success: false, data: null};
    }

    static async loadTracks(email) {
        var tracks = realm.objects(TRACK).filtered('email == $0', email);
        return {success: true, data: tracks};
    }

    static async loadTrackById(id) {
        var tracks = realm.objects(TRACK).filtered('id == $0', id);

        if (tracks.length > 0) {
            return {success: true, data: tracks[0]};
        }

        return {success: false, data: null};
    }

    static async loadLocations(id) {
        var locations = realm.objects(TRACK_DATA).filtered('id == $0', id);
        return {success: true, data: locations};
    }

    static async saveTmdTrack(track) {
        var myTrack = await RealmAPI._write(() => {
            return realm.create(TMD_TRACK, track, true);
        });

        return {success: true, data: myTrack};
    }

    static async saveTmdTrackName(track, name) {
        await RealmAPI._write(() => {
            track.name = name;
        });

        return {success: true, data: track};
    }

    static async saveTmdTrackReason(track, reason) {
        await RealmAPI._write(() => {
            track.reason = reason;
        });

        return {success: true, data: track};
    }

    static async loadTmdTracks(email) {
        var tracks = realm.objects(TMD_TRACK).filtered('email == $0', email);
        return {success: true, data: tracks};
    }

    static async saveUsergroups(usergroups) {
        var logindata = RealmAPI.getLoginData();
        await RealmAPI._write(() => {
            return realm.create(USERGROUPS, {
                email: logindata.email,
                usergroups: usergroups
            }, true);
        });
    }

    static async getUsergroups() {
        var logindata = RealmAPI.getLoginData();
        var usergroups = realm.objects(USERGROUPS).filtered('email == $0', logindata.email)
        return usergroups[0].usergroups;
    }


    static async getNumberOfTracks(email) {
        var numberOfTracks = 0;

        var tmdTracks = realm.objects(TMD_TRACK).filtered('email == $0 AND approved == false', email);
        var tracks = realm.objects(TRACK).filtered('email == $0', email);
        numberOfTracks = tmdTracks.length + tracks.length;

        return {success: true, data: numberOfTracks};
    }

    static async setTMDFlags(track, alreadySynced, approved, evaluation) {
        await RealmAPI._write(() => {
            track.alreadySynced = alreadySynced;
            track.approved = approved;
            track.evaluation = evaluation;
        });

        return {success: true, data: track};
    }

    static async setTMDTransportMode(track, sections, section, value) {
        for (var key in sections) {
            var currentSection = sections[key];

            if (currentSection.start.timestamp === section.start.timestamp) {
                await RealmAPI._write(() => {
                    currentSection.transportMode = value;
                });

                return {success: true, data: track};
            }
        }
    }

    static async setWaypoint(track, sections, section, value) {
        await RealmAPI._write(() => {
            section.waypoint = value;
        });

        return {success: true, data: track};
    }

    static async setEndpoint(track, sections, section, value) {

        await RealmAPI._write(() => {
            section.endpoint = value;
        });

        return {success: true, data: track};
    }

    // a helper function to await realm's write callbacks
    static async _write(func) {
        return new Promise((resolve, reject) => {
            realm.write(async () => {
                try {
                    var res = await func();
                    resolve(res);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }
}

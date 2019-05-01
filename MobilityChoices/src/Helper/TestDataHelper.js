import RealmAPI from '../Lib/RealmAPI';
import {Alert} from 'react-native';

export default class TestDataHelper {
    static async createTrack(email) {
        var date = new Date();
        var result = await RealmAPI.createTrack(email, date);

        if (result.success) {
            var trackId = result.data;

            /***** track for debugging can be added to tempData variable with following format:
             *
             *
             * [{
                "lng": DOUBLE,
                "lat": DOUBLE,
                "accuracy": DOUBLE,
                "time":  TIMESTAMP,
                "type": STRING,
                "confidence": DOUBLE,
                "altitude": DOUBLE,
                "speed": INTEGER
            }, *** repeat for all coordinates *** ]
             *
             *
             *
             *****/

            var tmpData = [{/** enter coordinates here **/}];

            var promises = [];
            var count = 0;

            for (var i in tmpData) {
                count++;
                var entry = tmpData[i];
                var timestamp = new Date(entry.time);
                timestamp.setDate(date.getDate());
                timestamp.setMonth(date.getMonth());
                timestamp.setFullYear(date.getFullYear());
                timestamp = timestamp.getTime();
                var coords = {
                    accuracy: entry.accuracy,
                    latitude: entry.lat,
                    longitude: entry.lng,
                    altitude: entry.altitude,
                    confidence: entry.confidence,
                    type: entry.type,
                    speed: entry.speed
                };

                promises.push(RealmAPI.savePosition(trackId, timestamp, coords));
            }

            await Promise.all(promises);
            result = await RealmAPI.trackDidSuccessfullyStop(trackId);

            Alert.alert("Debugging", "Added track '" + trackId + "' for debugging purposes: it contains '" + count + "' positions");

            return result.data;
        }

        return null;
    }
}

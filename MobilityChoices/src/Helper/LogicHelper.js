import {Alert} from 'react-native';
import MobilityAPI from '../Lib/MobilityAPI';

export default class LogicHelper {
    static async uploadTrack(positions, name, date) {
        if (!positions) {
            Alert.alert('Der Track ist zu kurz oder fehlerhaft.', 'Es müssen mindestens 100 GPS-Positionen erfasst worden sein, um die Verkehrsmittelerkennung durchzuführen. Löschen Sie den Track und achten Sie beim nächsten Mal auf die Anzahl der aufgenommenen Positionen.');
            return false;
        } else if (positions.length < 100) {
            Alert.alert('Der Track ist zu kurz.', 'Es müssen mindestens 100 GPS-Positionen erfasst worden sein, um die Verkehrsmittelerkennung durchzuführen. Löschen Sie den Track und achten Sie beim nächsten Mal auf die Anzahl der aufgenommenen Positionen.');
            return false;
        }

        var res = await MobilityAPI.uploadTrack(positions, name, date);
        if (res.success) {
            Alert.alert('Upload Erfolgreich', res.message);
            return true;
        } else {
            if (res.error.message === 'Network Error') {
                Alert.alert('Verbindung fehlgeschlagen', 'Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut!');
            } else if (res.error.response.status === 401) {
                Alert.alert('Unautorisiert', 'Bitte loggen Sie sich aus und erneut ein.');
            } else {
                Alert.alert('Fehler', res.error);
            }
            return false;
        }
    }
}

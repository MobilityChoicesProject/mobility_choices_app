import React from 'react';
import {Text} from 'native-base';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Moment from 'moment';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import fontelloConfig from '../IconConfig/config.json';
import {styles} from '../Styles/GlobalStyles';

const Icon = createIconSetFromFontello(fontelloConfig);

export default class Helper {
    static renderIconForType(type) {
        var tmpType = type.toUpperCase();

        switch (tmpType) {
            case 'BICYCLING':
            case 'BIKE':
                return (
                    <Icon name="icon_verkehrsmittel_fahrrad" style={styles.icons}/>
                );
            case 'DRIVING':
            case 'CAR':
                return (
                    <Icon name="icon_verkehrsmittel_auto" style={styles.icons}/>
                );
            case 'BUS':
                return (
                    <Icon name="icon_verkehrsmittel_bus" style={styles.icons}/>
                );
            case 'STATIONARY':
                return (
                    <Icon name="icon_verkehrsmittel_stillstand" style={styles.icons}/>
                );
            case 'TRAIN':
                return (
                    <Icon name="icon_verkehrsmittel_bahn" style={styles.icons}/>
                );
            case 'WALKING':
            case 'OTHER':
            case 'NON_VEHICLE':
            case 'NON-VEHICLE':
                return (
                    <Icon name="icon_verkehrsmittel_zufuss" style={styles.icons}/>
                );
            case 'FILLIN':
                return (
                    <Text> ... </Text>
                );
            default:
                return (
                    <Text> ? </Text>
                );
        }
    }

    static getPolylineColorForType(section) {
        switch (section.transportMode) {
            case 'BICYCLING':
            case 'BIKE':
                return '#2b52ff';
            case 'DRIVING':
            case 'CAR':
                return '#ff1510';
            case 'BUS':
            case 'TRAIN':
                return '#e78b17';
            case 'WALKING':
            case 'OTHER':
            case 'NON_VEHICLE':
            case 'NON-VEHICLE':
                return '#64a91b';
            case 'STATIONARY':
                return '#838383';
            default:
                return '#838383';
        }
    }

    static getGermanTransportType(type) {
        var tmpType = type.toUpperCase();

        switch (tmpType) {
            case 'BICYCLING':
            case 'BIKE':
                return 'Fahrrad';
            case 'DRIVING':
            case 'CAR':
                return 'Auto';
            case 'BUS':
                return 'Bus';
            case 'STATIONARY':
                return 'Stationär';
            case 'TRAIN':
                return 'Bahn';
            case 'WALKING':
            case 'OTHER':
            case 'NON_VEHICLE':
            case 'NON-VEHICLE':
                return 'Zu Fuß';
            case 'FILLIN':
                return '...';
            default:
                return '?';
        }
    }

    static renderIconForSectionType(v) {
        var value = v.toUpperCase();

        switch (value) {
            case 'ENDE':
                return (
                    <MaterialIcon name="dots-vertical" size={21} color="#4c4c4c"/>
                );
            case 'DEFAULT':
                return (
                    <MaterialIcon name="dots-vertical" size={21} color="#4c4c4c"/>
                );
            default:
                return (
                    <Text> ? </Text>
                );
        }
    }

    static renderFormattedDate(date, format) {
        let formattedDate = Moment(date).format(format);
        return (
            <Text style={{fontFamily: 'Hind-SemiBold', fontSize: 14, color: '#4e4e4e'}}>{formattedDate}</Text>
        );
    };

    static renderRoundedTime(time) {
        let timeRounded;
        if (time < 1) {
            timeRounded = "<1 min";
        } else if (time > 60) {
            var minTemp = Math.floor(time);
            var restMins = Math.round(time - minTemp);
            var hTemp = minTemp / 60;

            var h = Math.floor(hTemp);
            minTemp = hTemp - h;
            var min = Math.round(minTemp * 60) + restMins;

            timeRounded = h + "h " + min + "min"
        } else {
            var minutes = Math.round(time);
            timeRounded = minutes + " min"
        }
        return (
            <Text style={{fontSize: 14, color: '#4e4e4e', fontFamily: 'Hind-SemiBold'}}> {timeRounded} </Text>
        );
    };

    static renderRoundedDistance(distance) {
        let roundedDistanceText;
        if (distance < 1) {
            var distanceInMeter = distance * 1000; // convert distance into meters
            var roundedDistance = this.roundNumber(distanceInMeter, 0);
            roundedDistanceText = roundedDistance + " m";
        } else {
            var roundedDistance = this.roundNumber(distance, 2)
            roundedDistanceText = roundedDistance + " km";
        }
        return (
            <Text style={{fontSize: 14, fontFamily: 'Hind-Bold', color: '#4e4e4e'}}> {roundedDistanceText} </Text>
        );
    };

    /**
     * rounds a number to the specified decimal place length
     * @param number the number to round
     * s@param precision The number of decimal places to preserve
     */
    static roundNumber(number, precision) {
        var factor = Math.pow(10, precision);
        return Math.round(number * factor) / factor;
    };

    static renderCostsDependingOnCountry(costs, country) {
        let costsText;
        if (country === "CH") {
            costs = costs * 1.1;  // convert costs from Euro into Franken
            costsText = Math.ceil(costs) + " Fr";
        } else {
            costsText = Math.ceil(costs) + ",-";
        }
        return (
            <Text style={{fontFamily: 'Hind-SemiBold', fontSize: 14, color: '#4e4e4e'}}> {costsText} </Text>
        );
    };

    static hashCodeString(s) {
        var hash = 0, i, chr;
        if (s.length === 0) return hash;
        for (i = 0; i < s.length; i++) {
            chr = s.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

}

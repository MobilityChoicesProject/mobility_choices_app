import React, {Component} from 'react';
import {Alert, TouchableOpacity, View} from 'react-native';
import {Button, Left, Right, Spinner, Text} from 'native-base';
import RealmAPI from '../../../Lib/RealmAPI';
import Helper from '../../../Lib/HelperAPI';
import Moment from 'moment';
import LogicHelper from '../../../Helper/LogicHelper';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import fontelloConfig from '../../../IconConfig/config.json';
import {styles} from '../../../Styles/GlobalStyles';
import FCM, {
    FCMEvent,
    NotificationType,
    RemoteNotificationResult,
    WillPresentNotificationResult
} from 'react-native-firebase';

const Icon = createIconSetFromFontello(fontelloConfig);

export default class TrackComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            track: this.props.track,
            routeCoordinates: [],
            positions: [],
            loading: false,
            analyzing: false
        };
    }

    async componentDidMount() {
        var res = await RealmAPI.loadLocations(this.state.track.id);
        var coordinates = [];
        var pos = [];

        for (var key in res.data) {
            var currentLocation = res.data[key];
            var LatLng = {
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude
            }
            var position = {
                lat: currentLocation.latitude,
                lng: currentLocation.longitude,
                accuracy: currentLocation.accuracy,
                altitude: currentLocation.altitude,
                time: Moment(currentLocation.timestamp).format("YYYY-MM-DD[T]HH:mm:ss"),
                confidence: currentLocation.confidence,
                type: currentLocation.type,
                speed: currentLocation.speed
            };
            coordinates.push(LatLng);
            pos.push(position);
        }
        this.setState({
            positions: pos,
            routeCoordinates: coordinates
        });

        if (this.state.track.isAnalyzing === true) {
            this.setState({analyzing: true});
        }

        if (TrackComponent.notificationListener != null) {
            TrackComponent.notificationListener();
        }
        TrackComponent.notificationListener = FCM.notifications().onNotification(async (notif) => {
            if (notif.title === 'Auswertung erfolgreich') {
                RealmAPI.setTrackAnalyzation(this.state.track.id, false);
                this.setState({analyzing: false});
                this.props.remove(this.state.track);
            }
        });
    }

    sendDataToServer = async () => {
        this.setState({loading: true});
        var result = await LogicHelper.uploadTrack(this.state.positions, this.state.name, this.state.track.date);
        if (result) {
            var that = this;
            RealmAPI.setTrackAnalyzation(this.state.track.id, true).then(function () {
                that.setState({
                    loading: false,
                    analyzing: true
                });
            }).catch(function (error) {
                console.log(error);
            });
        }
        this.setState({loading: false});
    };

    deleteTrack = () => {
        Alert.alert(
            'Track löschen',
            'Sind Sie sicher, dass Sie den Track löschen wollen?',
            [
                {text: 'Ja', onPress: () => this.finalDelete()},
                {text: 'Nein', style: 'cancel'}
            ],
            {cancelable: false}
        )
    };

    async finalDelete() {
        await this.props.remove(this.state.track);
        RealmAPI.deleteTrack(this.state.track);
    }

    renderTrackAction() {
        if (this.state.track.isAnalyzing === false && this.state.track.isTracking === true) {
            return (
                <View style={{justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', width: 140}}>
                    <Text style={{color: '#8b8b8b', width: 120, fontSize: 12, fontFamily: 'Hind-Medium'}}>Aufzeichnung
                        läuft</Text>
                </View>
            )
        } else if (this.state.track.isAnalyzing === true && this.state.track.isTracking === false) {
            return (
                <View style={{justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', width: 140}}>
                    <Text style={{color: '#8b8b8b', width: 120, fontSize: 12, fontFamily: 'Hind-Medium'}}>Wird
                        ausgewertet</Text>
                </View>
            )
        } else {
            return (
                <View style={{justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center'}}>
                    <Button style={{
                        width: 130,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#78D1C0',
                        marginRight: 10,
                        height: 30
                    }} rounded primary onPress={this.sendDataToServer}>
                        {this.state.loading ? <Spinner color={'#ffffff'}/> :
                            <Text
                                style={styles.buttonText}>AUSWERTEN</Text>}
                    </Button>
                    <Icon onPress={this.deleteTrack} name="icon_papierkorb" size={27} color='#4e4e4e'/>
                </View>
            )
        }
    }

    render() {
        return (
            <TouchableOpacity style={{flexDirection: 'row', margin: 20}} onPress={() => {
                this.state.track.isTracking ?
                    Alert.alert("Aufzeichnung läuft", "Sie können Ihren Track ansehen, sobald die Aufzeichnung abgeschlossen wurde.") :
                    this.props.navigation.navigate({
                        key: 'TrackDetail',
                        routeName: 'TrackDetail',
                        params: {
                            track: this.state.track,
                            coordinates: this.state.routeCoordinates
                        }
                    })
            }}>
                <Left>
                    <View style={{flexDirection: 'column', alignItems: 'flex-start', marginLeft: 7}}>
                        <Text style={{
                            fontSize: 20,
                            fontFamily: 'Hind-SemiBold',
                            color: '#4e4e4e',
                            marginLeft: -2
                        }}>{this.state.track.name} </Text>
                        {Helper.renderFormattedDate(this.state.track.date, "DD.MM.YYYY")}
                    </View>
                </Left>
                <Right>
                    {this.renderTrackAction()}
                </Right>
            </TouchableOpacity>
        )
    }
}

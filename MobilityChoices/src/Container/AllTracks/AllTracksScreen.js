import React, {Component} from 'react';
import {Alert, AppState, FlatList, ScrollView, TouchableOpacity, View} from 'react-native';
import {Button, Container, Content, ListItem, Spinner, Text} from 'native-base';
import RealmAPI from '../../Lib/RealmAPI';
import MobilityAPI from '../../Lib/MobilityAPI';
import TmdTrackComponent from '../../Components/Track/AllTracksOverview/TmdTrackComponent';
import TrackComponent from '../../Components/Track/AllTracksOverview/TrackComponent';
import Modal from "react-native-modal";
import FinalTrackComponent from '../../Components/Track/AllTracksOverview/FinalTrackComponent';
import TestDataHelper from '../../Helper/TestDataHelper';
import DebugHelper from '../../Helper/DebugHelper';
import ObjectHelper from '../../Helper/ObjectHelper';
import Helper from '../../Lib/HelperAPI';
import FCM, {
    FCMEvent,
    NotificationType,
    RemoteNotificationResult,
    WillPresentNotificationResult
} from 'react-native-firebase';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import fontelloConfig from '../../IconConfig/config.json';
import {styles} from '../../Styles/GlobalStyles';
import Menu from "../../Components/Menu/Menu";
import {getHeaderStyle} from "../../Helper/IphoneXHelper";

var objectHash = require('object-hash');

const Icon = createIconSetFromFontello(fontelloConfig);

export default class AllTracksScreen extends Component {
    static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state;

        return {
            title: 'ALLE WEGE',
            headerLeft:
                <Icon name='icon_allewege' size={25} style={{marginLeft: 19, marginRight: 10}} color='#4e4e4e'/>,
            headerRight: <Button style={{margin: 10}} iconLeft transparent onPress={() => params.handleSync()}>
                <Icon name='icon_synchronisieren' style={{color: '#78D1C0', fontSize: 35}}/>
            </Button>,
            headerTitleStyle: {fontFamily: 'Hind-Medium', color: '#4e4e4e'},
            headerStyle: getHeaderStyle()
        }
    };
    static notificationListener = null;

    constructor(props) {
        super(props);
        this.state = {
            title: 'Alle Wege',
            email: '',
            tracks: [],
            tmdTracks: [],
            tmdTracksFinal: [],
            isSyncingAll: false,
            isSyncingNotReleased: false,
            isLoading: false,
            trackLenght: 0,
            tmdTrackLenght: 0,
            finalTmdTrackLength: 0,
            isModalVisible: false,
            loadTracks: true,
            appState: AppState.currentState,
            currentTmdTrackHash: ''
        };

    }


    async componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
        this._isMounted = true;
        this.props.navigation.setParams({handleSync: this.sync});

        var loginData = RealmAPI.getLoginData();
        this.setState({
            tmdTracks: [],
            email: loginData.email
        });

        if (AllTracksScreen.notificationListener != null) {
            // unregister the previous listener
            AllTracksScreen.notificationListener();
        }
        AllTracksScreen.notificationListener = FCM.notifications().onNotification(async (notif) => {
            // there are two parts of notif.notification contains the notification payload, notif.data contains data payload
            if (notif.local_notification) {
                //this is a local notification
            }

            if (notif.opened_from_tray) {
                //app is open/resumed because user clicked banner
            }

            if (notif.title === 'Auswertung erfolgreich') {

                setTimeout(() => {
                    this.loadTracksfromServer(true)
                }, 2000);
            } else if (notif.title === 'Freigeben erfolgreich') {
                this.loadTracksfromServer();
            }
        });

        this.loadTracksfromServer();

    }


    componentWillUnmount() {
        this._isMounted = false;
        this.props.navigation.state.params.onClose();
        AppState.removeEventListener('change', this._handleAppStateChange);

    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props != prevProps) {
            // this.refreshTrackList();
            this.loadTracksfromServer(true);
        }
    }

    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            this.loadTracksfromServer(true);
        }
        this.setState({appState: nextAppState});
    }

    sync = () => {
        Alert.alert(
            'Synchronisierung',
            'Beim Synchronisieren der Tracks gehen nicht freigegebene lokale Änderungen verloren. Sind Sie sicher, dass sie Ihre gespeicherten Tracks laden möchten?',
            [
                {text: 'Ja', onPress: this.loadTracksfromServer},
                {text: 'Nein', style: 'cancel'},
            ],
            {cancelable: false}
        )
    };

    async generateHashList() {
        var hashArray = [];
        var loginData = RealmAPI.getLoginData();
        var tracks = await RealmAPI.loadTmdTracks(loginData.email);
        tracks = tracks.data;

        for (var i = 0; i < tracks.length; i++) {
            var track = JSON.parse(JSON.stringify(tracks[i], function (key, value) {
                if (key === "coordinates") return undefined;
                else if (key === "mobilityUserId") return undefined;
                else if (key === "waypoint") return undefined;
                else if (key === "endpoint") return undefined;
                else if (key === "probabilities") return undefined;
                else if (key === "correctnessscore") return undefined;
                else if (key === "evaluation") return undefined;
                else if (key === "endtime") return undefined;
                else if (key === "startTime") return undefined;
                else return value;
            }));
            track.sections = Object.values(track.sections);
            var hash = await objectHash(track, {
                respectFunctionProperties: false,
                respectFunctionNames: false,
                respectType: false
            });
            hashArray.push({"id": track.id, "hash": hash});
        }
        return hashArray;
    }

    loadTracksfromServer = async (loadPartially) => {
        if (!loadPartially) {
            // delete all local tmd tracks
            await RealmAPI.deleteAllTmdTracks();
            this.setState({isSyncingAll: true});
        }

        var res;
        if (loadPartially && this.state.tmdTracks && this.state.tmdTracksFinal && (this.state.tmdTracks.length > 0 || this.state.tmdTracksFinal.length > 0)) {
            //hash änderungen
            this.setState({isSyncingAll: true});

            var hashArray = await this.generateHashList();
            res = await MobilityAPI.refreshTMDTracks(hashArray);
        } else {
            this.setState({isSyncingAll: true});
            res = await MobilityAPI.getTMDTracks();
        }
        // We need to transform the data for the realm model. Without this a type error would be raised.
        var promises = [];
        for (var key in res.data) {
            var currentTrack = res.data[key];
            // make a copy
            // We need this code to avoid type issues with realm.
            if (!ObjectHelper.isArray(currentTrack.sections)) {
                let sections = currentTrack.sections;
                currentTrack.sections = Object.values(sections);
            }

            var sections = currentTrack.sections;

            for (var i = 0; i < sections.length; i++) {
                var section = sections[i];
                let coordinates = section.coordinates;
                let probabilities = section.probabilities;

                if (section.distance == null) {
                    section.distance = 0.0;
                }

                if (section.waypoint == null) {
                    section.waypoint = false;
                }

                if (section.endpoint == null) {
                    section.endpoint = false;
                }

                if (!ObjectHelper.isArray(coordinates)) {
                    section.coordinates = Object.values(coordinates);
                }

                if (!ObjectHelper.isArray(probabilities)) {
                    section.probabilities = Object.values(probabilities)
                }
                for (var j = 0; j < probabilities.length; j++) {
                    var probability = probabilities[j];
                    if (!ObjectHelper.isArray(probability)) {
                        probabilities[j] = Object.values(probability)
                    }
                    var prob = probabilities[j];
                    if (typeof prob[1] === 'string') {
                        prob[1] = Number(prob[1])
                    }
                    probabilities[j] = prob;
                }
                section.probabilities = probabilities;
            }

            var func = async () => {
                try {
                    RealmAPI.saveTmdTrack(currentTrack);
                } catch (error) {
                    Alert.alert("Fehler", error.toString());
                }
            };

            promises.push(func());
        }
        await Promise.all(promises);
        await this.setState({isSyncingAll: false, isSyncingNotReleased: false, isLoading: true});
        await this.refreshTrackList();
    }


    refreshTrack = async () => {
        this.setState({trackLenght: this.getSwitchedValue(this.state.trackLenght)});
    }

    refreshTmdTrack = async () => {
        this.setState({tmdTrackLenght: this.getSwitchedValue(this.state.tmdTrackLenght)});
    }

    refreshFinalTmdTrack = async () => {
        this.setState({finalTmdTrackLength: this.getSwitchedValue(this.state.finalTmdTrackLength)});
    }

    getSwitchedValue(value) {
        return !Boolean(value);
    }

    refreshTrackList = async () => {
        await this.setState({isLoading: true});

        var tracks = [];
        var tmdTracks = [];
        var tmdTracksFinal = [];
        var promises = [];
        var func;

        func = async () => {
            var res = await RealmAPI.loadTracks(this.state.email);

            if (res.data.length > 0) {
                var finishedOldTrack = false;

                for (var key in res.data) {
                    var currentTrack = res.data[key];
                    currentTrack.key = key;

                    if (currentTrack.id !== this.props.screenProps.getTrack() && currentTrack.isTracking) {
                        await RealmAPI.trackDidSuccessfullyStop(currentTrack.id);
                        finishedOldTrack = true;
                    }

                    tracks.push(currentTrack);
                }

                if (finishedOldTrack) {
                    Alert.alert('Track beendet.', 'Ihr letztes Tracking wurde beendet, da Sie die App unerwartet geschlossen haben. ' +
                        'Sie können den Track trotzdem noch hochladen, falls genug GPS-Punkte getrackt wurden.');
                }
            } else if (DebugHelper.isDebugMode()) {
                var newTrack = await TestDataHelper.createTrack(this.state.email);
                tracks.push(newTrack);
            }
        };

        promises.push(func());
        func = async () => {
            var result = await RealmAPI.loadTmdTracks(this.state.email);

            if (result.success && result.data.length > 0) {
                for (var key in result.data) {
                    var currentTmd = result.data[key];

                    if (currentTmd.approved) {
                        tmdTracksFinal.push(currentTmd);
                    } else {
                        tmdTracks.push(currentTmd);
                    }
                }
            }
        };

        promises.push(func());
        await Promise.all(promises);

        // Sort from current date to old ones: old dates will therefore be at the end/bottom of the list.
        tracks = tracks.sort((a, b) => b.date - a.date);
        tmdTracksFinal = tmdTracksFinal.sort((a, b) => b.date - a.date);
        tmdTracks = tmdTracks.sort((a, b) => b.date - a.date);


        await this.setState({
            tracks: tracks,
            tmdTracks: tmdTracks,
            tmdTracksFinal: tmdTracksFinal,
            isLoading: false
        });


        //remove analyzing tracks after coming back from background
        var analyzingTracks = tracks.filter(function (item) {
            return item.isAnalyzing;
        });

        var oldHash = this.state.currentTmdTrackHash;
        if (this.state.tmdTracks) {
            await this.setState({currentTmdTrackHash: Helper.hashCodeString(this.state.tmdTracks.toString())})
        }
        if (oldHash !== this.state.currentTmdTrackHash) {
            for (var i in analyzingTracks) {
                var currentTrack = analyzingTracks[i];
                for (var j in tmdTracks) {
                    var currentTmdTrack = tmdTracks[j];
                    if (currentTrack.date.toString() === currentTmdTrack.date.toString()) {
                        RealmAPI.setTrackAnalyzation(currentTrack.id, false);
                        this.removeTrack(currentTrack);
                    }
                }
            }
        }
    };


    _toggleModal = () => {
        this.setState({isModalVisible: !this.state.isModalVisible});
    }

    removeTrack = async (track) => {
        await this.removeGenericTrack(this.state.tracks, track, 'tracks', 'trackLenght');
        RealmAPI.deleteTrack(track);
    }

    removeTmdTrack = async (track) => {
        await this.removeGenericTrack(this.state.tmdTracks, track, 'tmdTracks', 'tmdTrackLenght');
    }

    removeFinalTmdTrack = async (track) => {
        await this.removeGenericTrack(this.state.tmdTracksFinal, track, 'tmdTracksFinal', 'finalTmdTrackLength');
    }

    removeGenericTrack = async (tracks, track, propertyName, refreshPropertyName) => {
        var i = tracks.findIndex(x => x.id === track.id);
        tracks.splice(i, 1); // remove the item
        var list = tracks.slice(); // create a new array with all references

        this.updateList(tracks, list, propertyName, refreshPropertyName);
    }

    upgradeFirstTrack = async (track) => {
        // do not update the view when the view is not mounted
        if (this._isMounted) {
            var list = this.state.tmdTracks.slice();
            // to the first position in the list
            list.unshift(track);
        }

        RealmAPI.saveTmdTrack(track);

        // do not update the view when the view is not mounted
        if (this._isMounted) {
            this.updateList(this.state.tmdTracks, list, "tmdTracks", "tmdTrackLenght");
        }
    }

    // move to the final tracks area
    upgradeTmdTrack = async (track) => {
        await this.removeTmdTrack(track);
        var list = this.state.tmdTracksFinal.slice();
        // to the first position in the list
        list.unshift(track);

        this.updateList(this.state.tmdTracksFinal, list, "tmdTracksFinal", "finalTmdTrackLength");
    }

    updateList(tracks, newList, propertyName, refreshPropertyName) {
        this.setState({
            [propertyName]: newList,
            [refreshPropertyName]: tracks.length + 1
        });
    }


    render() {
        return (
            <Container style={{backgroundColor: '#fff'}}>
                <View>
                    <Modal isVisible={this.state.isModalVisible} onBackdropPress={() => this._toggleModal()}>
                        <View style={styles.modalContent}>
                            <Text style={{
                                fontSize: 16,
                                fontFamily: 'Hind-Bold',
                                color: '#4e4e4e',
                                marginTop: 10
                            }}>{'WAS BEDEUTEN DIE SYMBOLE?'}</Text>
                            <ScrollView>
                                <View style={{margin: 10, alignContent: 'center'}}>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            marginRight: 20,
                                            fontFamily: 'Hind-Medium',
                                            color: '#4e4e4e'
                                        }}>{'Neben Ihren ausgewerteten und freigegebenen Wegen sehen Sie die Symbole für die Kategorien Gesundheit, Zeit, Kosten und Umwelt. ' +
                                    'Die Symbole können farbig, dunkelgrau oder hellgrau dargestellt werden. ' +
                                    'Wenn ein Symbol einer Kategorie farbig ist, bedeutet dies, dass dieser Weg in der entsprechenden Kategorie im Vergleich zu den möglichen Alternativen ' +
                                    '(die Sie in der Detailansicht der einzelnen Wege einsehen können) sehr gut ist. ' +
                                    'Wenn das Symbol dunkelgrau ist, ist der Weg in dieser Kategorie weniger gut geeignet und ein hellgraues ' +
                                    'Symbol deutet darauf hin, dass es für diese Kategorie besser geeignete Wege gibt.'}</Text>
                                </View>
                                <View style={{flexDirection: 'column'}}>
                                    <Text style={{
                                        fontSize: 16,
                                        marginBottom: 5,
                                        fontFamily: 'Hind-Bold',
                                        color: '#4e4e4e'
                                    }}>{'BEISPIEL'}</Text>
                                    <View style={{flexDirection: 'row'}}>
                                        <Icon name='icon_umwelt'
                                              style={{fontSize: 20, color: '#B0CE00', marginRight: 5}}/>
                                        <Text style={{
                                            fontSize: 14,
                                            marginBottom: 5,
                                            marginRight: 20,
                                            fontFamily: 'Hind-Medium',
                                            color: '#4e4e4e'
                                        }}>{'Dies bedeutet, dass der Weg in Bezug auf die Umwelt und im Vergleich zu den alternativen Wegen sehr umweltschonend ist.'}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <Icon name='icon_umwelt'
                                              style={{fontSize: 20, color: '#8b8b8b', marginRight: 5}}/>
                                        <Text style={{
                                            fontSize: 14,
                                            marginBottom: 5,
                                            marginRight: 20,
                                            fontFamily: 'Hind-Medium',
                                            color: '#4e4e4e'
                                        }}>{'Der Weg ist in der Kategorie Umwelt zwar nicht schlecht im Vergleich zu den Alternativen, jedoch gibt es noch bessere Möglichkeiten.'}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <Icon name='icon_umwelt'
                                              style={{fontSize: 20, color: '#CFD9D9', marginRight: 5}}/>
                                        <Text style={{
                                            fontSize: 14,
                                            marginRight: 20,
                                            fontFamily: 'Hind-Medium',
                                            color: '#4e4e4e'
                                        }}>{'Es gibt in Bezug auf den Umweltaspekt eindeutig bessere alternative Wege.'}</Text>
                                    </View>
                                    <View style={{margin: 10, alignContent: 'center'}}>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginRight: 20,
                                                fontFamily: 'Hind-Medium',
                                                color: '#4e4e4e'
                                            }}>{'Der Gesundheitswert wird allerdings anders bewertet. Hier wird der Wert nicht mit Alternativen verglichen ' +
                                        'sondern nur basierend auf dem Track bewertet. Zwischen 0 und 8 wird der ' +
                                        'Gesundheitswert als schlecht (hellgrau) betrachtet, zwischen 9 und 39 ist ' +
                                        'der Wert gut (dunkelgrau) und ab 40 sehr gut (farbig).'}
                                        </Text>
                                    </View>

                                </View>
                            </ScrollView>
                            <View style={{width: "100%"}}>
                                <TouchableOpacity onPress={this._toggleModal}>
                                    <View style={styles.modalbutton1}>
                                        <Text style={styles.buttonText}>{'VERSTANDEN'}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
                <Content contentContainerStyle={{
                    backgroundColor: '#fff',
                    marginLeft: 13,
                    marginRight: 13,
                    marginTop: 10
                }}>
                    <ListItem style={styles.listItemAllTracks} itemDivider>
                        <Text style={styles.headingsAllTracks}>AUSZUWERTENDE AUFZEICHNUNGEN</Text>
                    </ListItem>
                    {this.state.isLoading ?
                        <Spinner color={'#78D1C0'}/> :
                        <FlatList keyExtractor={(item, i) => item.id}
                                  data={this.state.tracks}
                                  extraData={this.state.tmdTrackLenght}
                                  automaticallyAdjustContentInsets={false}
                                  renderItem={({item}) =>
                                      <TrackComponent refresh={this.refreshTrack}
                                                      remove={this.removeTrack}
                                                      track={item}
                                                      navigation={this.props.navigation}/>
                                  }/>
                    }
                    <ListItem style={styles.listItemAllTracks} itemDivider>
                        <Text style={styles.headingsAllTracks}>FREIZUGEBENDE AUFZEICHNUNGEN</Text>
                    </ListItem>
                    {this.state.isSyncingNotReleased || this.state.isSyncingAll || this.state.isLoading ?
                        <Spinner color={'#78D1C0'}/> :
                        <FlatList keyExtractor={(item, i) => item.id}
                                  data={this.state.tmdTracks}
                                  extraData={this.state.tmdTrackLenght}
                                  automaticallyAdjustContentInsets={false}
                                  renderItem={({item}) =>
                                      <TmdTrackComponent refresh={this.refreshTmdTrack}
                                                         remove={this.removeTmdTrack}
                                                         upgrade={this.upgradeTmdTrack}
                                                         track={item}
                                                         navigation={this.props.navigation}/>
                                  }/>
                    }
                    <ListItem style={styles.listItemAllTracks} itemDivider>
                        <Text style={styles.headingsAllTracks}>FREIGEGEBENE & AUSGEWERTETE WEGE</Text>
                        <TouchableOpacity
                            style={{width: 17, backgroundColor: '#4e4e4e', borderRadius: 40, marginLeft: 10}}
                            onPress={() => this._toggleModal()}>
                            <Text style={{fontSize: 12, color: '#fff'}}>?</Text>
                        </TouchableOpacity>
                    </ListItem>
                    {this.state.isSyncingAll || this.state.isLoading ?
                        <Spinner color={'#78D1C0'}/> :
                        <FlatList keyExtractor={(item, i) => item.id}
                                  data={this.state.tmdTracksFinal}
                                  extraData={this.state.finalTmdTrackLength}
                                  automaticallyAdjustContentInsets={false}
                                  renderItem={({item}) =>
                                      <FinalTrackComponent refresh={this.refreshFinalTmdTrack}
                                                           remove={this.removeFinalTmdTrack}
                                                           track={item}
                                                           navigation={this.props.navigation}/>
                                  }/>
                    }
                </Content>
                <Menu navigation={this.props.navigation} loadTracks={this}/>
            </Container>
        )
    }
}

import React, {Component} from 'react';
import {
    Alert,
    AppState,
    AsyncStorage,
    Image,
    Platform,
    ScrollView,
    TouchableHighlight,
    TouchableOpacity,
    View
} from 'react-native';
import {Badge, Button, Container, Content, Spinner, Text,} from 'native-base';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import {fromJS} from 'immutable';
import MobilityAPI from '../../Lib/MobilityAPI';
import RealmAPI from '../../Lib/RealmAPI';
import {NavigationActions} from 'react-navigation';
import Modal from "react-native-modal";
import {styles} from '../../Styles/GlobalStyles';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import fontelloConfig from '../../IconConfig/config.json';
import CheckBox from 'react-native-checkbox';
import PrivacyPolicyComponent from '../../Components/PrivacyPolicy/PrivacyPolicyComponent';
import ObjectHelper from '../../Helper/ObjectHelper';
import Permissions from 'react-native-permissions';

const Icon = createIconSetFromFontello(fontelloConfig);

const resetAction = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({routeName: 'Login'})
    ]
})

export default class Dashboard extends Component {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.interval = null;
        this.state = {
            title: 'Dashboard',
            loadingAllTracks: false,
            loadingPlanRoute: false,
            loadingProfile: false,
            email: '',
            isModalVisible: false,
            isModalPrivacyStatementVisible: false,
            isPrivacyStatementChecked: false,
            myProfile: {},
            newTracks: 0,
            accuracy: 0,
            counter: 0,
            signal: '',
            isTracking: false,
            signalaccuracy: 0,
            signalaccuracydate: null,
            motionPermission: "",
            signaltext: '0 %',
            posCount: 0,
            data: fromJS({
                sceneTitle: '',
                locations: [],
                currentTrack: 0,
            })
        };
    }

    async componentWillMount() {
        var loginData = RealmAPI.getLoginData();
        var email = loginData.email;

        var res = await RealmAPI.getNumberOfTracks(email);
        var num = res.data;

        this.setState({
            email: email,
            counter: 0,
            newTracks: num
        });

        if (this.props.screenProps.getTrack() !== '') {
            this.updateTrackingState();
        }

        this.checkAcceptedPrivacyPolicy();
    }

    async checkAcceptedPrivacyPolicy() {
        await RealmAPI.loadProfile(this.state.email).then(async profile => {
            if (profile.success) {
                var myData = await ObjectHelper.copyProperties(profile.data);
                this.setState({myProfile: myData});
            }
        });

        if (this.state.myProfile.AcceptPrivacyPolicy == false) {
            this._togglePrivacyStatementModal();
        }
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.getAccuracy();
            this.forceUpdate();
        }, 5000); //5 seconds

        AppState.addEventListener('change', this._handleAppStateChangeForTracking);
    }

    _toggleModal = () => {
        this.setState({isModalVisible: !this.state.isModalVisible});
    }

    _togglePrivacyStatementModal = () => {
        this.setState({isModalPrivacyStatementVisible: !this.state.isModalPrivacyStatementVisible});
    }

    _handleAppStateChangeForTracking = (nextAppState) => {
        switch (nextAppState) {
            case 'background':
                if (this.getTrackingState()) {
                    // set a timer to stop the tracking
                    this.props.screenProps.startTrackingTimer();
                }
                break;
            case 'inactive':
                break;
            case 'active':
                console.log("ACTIVE STATE");
                // do not cancel the tracking when the user is using the app
                this.props.screenProps.stopTrackingTimer();
                // update the view
                var that = this;
                setTimeout(function () {
                    that.updateTrackingState();
                }, 1000);

                break;
        }
    }

    startTracking = async () => {
        var date = new Date();

        if (Platform.OS === 'ios') {
            await Permissions.check('motion', {type: 'always'}).then(response => {
                this.setState({motionPermission: response})
            });
            if (this.state.motionPermission != "authorized") {
                Alert.alert("Bewegungs- und Fitnessdaten", "Bitte aktivieren Sie Ihre Bewegungs- und Fitnesdaten für eine genauere Auswertung Ihrer aufgezeichneten Wege.",
                    [
                        {text: 'Abbrechen', style: 'cancel'},
                        {
                            text: 'Einstellungen', onPress: () => {
                                Permissions.openSettings()
                            }
                        }
                    ], {cancelable: false}
                );
            }
        }
        if (!this.state.email) {
            Alert.alert(
                'Fehler',
                'Keine gespeicherte Emailadresse gefunden. Bitte melden Sie sich neu an und versuchen Sie es noch einmal.',
                [
                    {
                        text: 'OK', onPress: () => {
                            this.logout();
                        }
                    },
                    {text: 'Abbrechen', style: 'cancel'},
                ],
                {cancelable: false}
            );
        } else {
            var startTracking = false;

            if (Platform.OS == 'android') {
                let locationService = await LocationServicesDialogBox.checkLocationServicesIsEnabled({
                    message: "<h2>Standort verwenden?</h2>Diese App möchte Ihre Standort-Einstellungen ändern.<br/><br/>Erlauben Sie, die Einstellungen zu ändern?<br/</a>",
                    ok: "JA",
                    cancel: "NEIN",
                    enableHighAccuracy: true,
                    showDialog: true,
                    openLocationServices: true,
                    preventOutSideTouch: true,
                    preventBackClick: false
                }).catch(error => error);
                startTracking = locationService.enabled;
            } else {
                startTracking = true;
            }
            if (startTracking) {
                this.setState({isTracking: true});
                var res = await RealmAPI.createTrack(this.state.email, date);
                this.props.screenProps.startTracking(res.data);
            }
        }
    };

    stopTracking = async () => {
        posCount = await this.props.screenProps.getLocationCountForCurrentTracking();
        var canTrackingSuccessfullyStop = await this.props.screenProps.canTrackingSuccessfullyStop();

        if (canTrackingSuccessfullyStop) {
            this.props.screenProps.stopTracking();
            this.updateTrackingState();

            this.setState({data: this.state.data.set('tracking', false)});

            var res = await RealmAPI.getNumberOfTracks(this.state.email);
            this.setState({newTracks: res.data, counter: 0});
        } else {
            this.setState({posCount: posCount});
            this._toggleModal();
        }

        this.updateTrackingState();
    };

    cancelTracking = () => {
        this.props.screenProps.cancelTracking();
        this.setState({isTracking: false});
        this.updateTrackingState();
        this.setState({isModalVisible: false});
    };

    logout = async () => {
        await MobilityAPI.logout();
        this.stopIntervals();
        this.props.navigation.dispatch(resetAction);
    };

    stopIntervals = () => {
        if (this.interval) {
            clearInterval(this.interval);
        }
    };

    touchAllTracks = async () => {
        this.props.navigation.navigate({
            key: 'AllTracks', routeName: 'AllTracks', params: {
                onClose: async () => {
                    var res = await RealmAPI.getNumberOfTracks(this.state.email);
                    this.setState({
                        newTracks: res.data,
                        counter: 0
                    });
                }
            }
        })
    };

    touchPlanRoute = () => {
        this.props.navigation.navigate({
            key: 'PlanRoute', routeName: 'PlanRoute', params: {
                start: '', end: '', onClose: async () => {
                    var res = await RealmAPI.getNumberOfTracks(this.state.email);
                    this.setState({
                        newTracks: res.data,
                        counter: 0
                    });
                }
            }
        });
    };

    touchProfile = () => {
        this.props.navigation.navigate({
            key: 'Profile', routeName: 'Profile', params: {
                onClose: async () => {
                    var res = await RealmAPI.getNumberOfTracks(this.state.email);
                    this.setState({
                        newTracks: res.data,
                        counter: 0
                    });
                }
            }
        })
    };

    async updateTrackingState() {
        var state = await this.props.screenProps.trackingState();
        this.setState({isTracking: state.enabled});
    }

    getTrackingState() {
        return this.state.isTracking;
    }

    async getAccuracy() {
        if (this.state.isTracking) {
            try {
                const asyncsignalaccuracy = await AsyncStorage.getItem('@MyStorage:accuracy');
                this.setState({signalaccuracy: asyncsignalaccuracy});

                const asynsignalaccuracydate = await AsyncStorage.getItem('@MyStorage:accuracydate');
                this.setState({signalaccuracydate: new Date(JSON.parse(asynsignalaccuracydate))});

                const thirtyseconds = 30000;

                if (((new Date) - this.state.signalaccuracydate) < thirtyseconds) {

                    if (this.state.signalaccuracy >= 170) {
                        this.setState({signaltext: '0 %'});
                    } else {
                        const percentage = 100 - ((100 / 170) * this.state.signalaccuracy);
                        this.setState({signaltext: percentage.toFixed(0) + ' %'});
                    }

                } else {
                    this.setState({
                        signaltext: '0 %',
                        signalaccuracy: 0
                    });
                }
            } catch (error) {
                console.log("Error retrieving data" + error);
            }
        } else {
            this.setState({
                signaltext: '0 %',
                signalaccuracy: 0
            });
        }
    }

    showPrivacyPolicy = () => {
        this.props.navigation.navigate({key: 'PrivacyPolicy', routeName: 'PrivacyPolicy'});
    };

    showSiteNotice = () => {
        this.props.navigation.navigate({key: 'AppNotice', routeName: 'AppNotice'});
    };

    updateAccepted = (checked) => {
        this.setState({isPrivacyStatementChecked: checked});
    };

    accept() {
        if (this.state.isPrivacyStatementChecked) {

            newProfile = this.state.myProfile;
            newProfile.AcceptPrivacyPolicy = true;

            this.setState({myProfile: newProfile});
            this.saveProfile();

            this._togglePrivacyStatementModal();
        } else {
            Alert.alert('Hinweis', 'Sie müssen zuerst die Datenschutzerklärung akzeptieren.');
        }
    }

    saveProfile = async () => {
        //save profile locale
        RealmAPI.createOrUpdateProfile(this.state.myProfile);

        //sync profile with sever
        MobilityAPI.updateProfile(this.state.myProfile).then(res => {
            if (res.success == true) {
                var profile = res.data;
                this.setState({myProfile: profile});
            } else {
                var profile = this.state.myProfile;
                this.setState({
                    myProfile: profile,
                });
            }
        });
    };

    render() {
        const title = this.getTrackingState() ? 'AUFZEICHNUNG\nABSCHLIESSEN' : 'WEG\nAUFZEICHNEN';
        const handler = this.getTrackingState() ? this.stopTracking : this.startTracking;
        const iconName = this.getTrackingState() ? "icon_wegabschliessen" : "icon_wegaufzeichnen";
        return (
            <Container style={{backgroundColor: '#fff'}}>
                <View testID='dashboardView'>
                    <Modal isVisible={this.state.isModalVisible}
                           onBackdropPress={() => this._toggleModal()}
                    >
                        <View style={styles.modalContent}>
                            <Text style={{
                                marginLeft: 10,
                                fontSize: 16,
                                alignSelf: 'stretch',
                                textAlign: 'left',
                                fontWeight: 'bold',
                                color: '#78D1C0'
                            }}>{'ACHTUNG'}</Text>
                            <View style={{margin: 10, alignContent: 'center'}}>
                                <Text>{'Ihr zurückgelegter Weg ist leider noch nicht lang genug. Es wurden erst ' + this.state.posCount + ' Positionen gefunden.'}</Text>
                            </View>
                            <View style={{
                                width: "100%",
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <TouchableOpacity onPress={this.cancelTracking} style={{width: '50%'}}>
                                    <View style={styles.modalbutton2}>
                                        <Text style={styles.buttonText}>{'ABBRECHEN'}</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this._toggleModal} style={{width: '50%'}}>
                                    <View style={styles.modalbutton1}>
                                        <Text style={styles.buttonText}>{'FORTSETZEN'}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    <Modal isVisible={this.state.isModalPrivacyStatementVisible}>
                        <View style={styles.modalContent}>
                            <Text style={{
                                fontSize: 15,
                                fontWeight: 'bold'
                            }}>{'NEUE NUTZUNGSBEDINGUNGEN UND DATENSCHUTZERKLÄRUNG'}</Text>
                            <View style={{borderTopColor: '#4c4e4f', borderTopWidth: 1, width: '100%', marginTop: 10}}/>
                            <ScrollView
                                ref="scrollView"
                                style={{height: 300,}}
                                showsHorizontalScrollIndicator={true}
                            >
                                <PrivacyPolicyComponent/>
                            </ScrollView>
                            <View style={{
                                borderTopColor: '#4c4e4f',
                                borderTopWidth: 1,
                                width: '100%',
                                marginBottom: 20
                            }}/>
                            <View style={{width: '100%'}}>
                                <View style={{flexDirection: "row", alignItems: "center"}}>
                                    <CheckBox label="" onChange={this.updateAccepted}/>
                                    <Text
                                        style={{marginLeft: 15}}>{"Ich akzeptiere die \nNeue Datenschutzerklärung"}</Text>
                                </View>
                                <View style={{marginTop: 20}}>
                                    <Button style={styles.blueButton} full rounded primary
                                            onPress={() => this.accept()}>
                                        <Text style={styles.buttonText}>WEITER</Text>
                                    </Button>
                                </View>
                            </View>

                            <View style={{width: "100%"}}>

                            </View>
                        </View>
                    </Modal>
                </View>
                <Content contentContainerStyle={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    marginTop: 20
                }}>
                    <View style={{
                        flex: 1.7,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginLeft: 30,
                        marginRight: 30
                    }}>
                        <View style={{flex: 1}}>
                            <TouchableOpacity underlayColor={'#A4D1F0'} onPress={this.touchProfile}>
                                <View style={styles.profileButton}>
                                    {this.state.loadingProfile ? <Spinner color={'#78D1C0'}/> :
                                        <Image source={require('../../../resources/icons/icon_MeinProfil.png')}
                                               style={{width: 43, height: 43}}/>}
                                    {this.state.loadingProfile ? null :
                                        <Text style={{
                                            marginTop: 10,
                                            fontSize: 12,
                                            color: '#4e4e4e',
                                            textAlign: 'center',
                                            fontFamily: 'Hind-Bold'
                                        }}>MEIN{"\n"}PROFIL</Text>}
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1}}>
                            <TouchableOpacity underlayColor={'#A4D1F0'} onPress={this.touchAllTracks}>
                                <View style={styles.profileButton}>
                                    {this.state.loadingAllTracks ? <Spinner color={'#78D1C0'}/> :
                                        <Image source={require('../../../resources/icons/icon_AlleWege.png')}
                                               style={{width: 43, height: 43}}/>}
                                    {this.state.loadingAllTracks ? null :
                                        <Text style={{
                                            marginTop: 10,
                                            fontSize: 12,
                                            color: '#4e4e4e',
                                            textAlign: 'center',
                                            fontFamily: 'Hind-Bold'
                                        }}>ALLE
                                            WEGE</Text>}
                                    {this.state.newTracks === 0 ? null :
                                        <Badge success style={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 10,
                                            backgroundColor: '#78D1C0'
                                        }}>
                                            <Text>{this.state.newTracks}</Text>
                                        </Badge>}
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1}}>
                            <TouchableOpacity underlayColor={'#A4D1F0'} onPress={this.touchPlanRoute}>
                                <View style={styles.profileButton} transparent>
                                    {this.state.loadingPlanRoute ? <Spinner color={'#78D1C0'}/> :
                                        <Image source={require('../../../resources/icons/icon_RoutePlanen.png')}
                                               style={{width: 43, height: 43}}/>}
                                    {this.state.loadingPlanRoute ? null :
                                        <Text style={{
                                            marginTop: 10,
                                            fontSize: 12,
                                            color: '#4e4e4e',
                                            textAlign: 'center',
                                            fontFamily: 'Hind-Bold'
                                        }}>ROUTE{"\n"}PLANEN</Text>}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{flex: 2.3, justifyContent: 'center'}}>
                        <TouchableHighlight underlayColor={'#ffffff'} onPress={handler}>
                            <View style={styles.profileButton}>
                                {this.state.loadingProfile ? <Spinner color={'#78D1C0'}/> :
                                    <Icon name={iconName} style={{color: '#78D1C0', fontSize: 55}}/>}
                                <Text style={{
                                    marginTop: 10,
                                    fontSize: 16,
                                    textAlign: 'center',
                                    color: '#4e4e4e',
                                    fontFamily: 'Hind-Bold'
                                }}>{title}</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={{flex: 1.5, justifyContent: 'center', alignItems: 'center'}}>
                        <View>
                            <Button style={{height: 35}} full transparent onPress={this.logout}>
                                <Text style={{fontSize: 10, color: '#8b8b8b', fontFamily: 'Hind-Bold'}}>LOGOUT</Text>
                            </Button>
                            <Button style={{height: 35}} full transparent onPress={() => this.showPrivacyPolicy()}>
                                <Text style={{
                                    fontSize: 10,
                                    color: '#8b8b8b',
                                    fontFamily: 'Hind-Bold'
                                }}>DATENSCHUTZERKLÄRUNG</Text>
                            </Button>
                            <Button style={{height: 35}} full transparent onPress={() => this.showSiteNotice()}>
                                <Text style={{
                                    fontSize: 10,
                                    color: '#8b8b8b',
                                    fontFamily: 'Hind-Bold'
                                }}>IMPRESSUM</Text>
                            </Button>
                        </View>
                    </View>
                    <View style={{flex: 0.5, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{
                            color: '#78D1C0',
                            fontSize: 16,
                            fontFamily: 'Hind-Bold'
                        }}>GPS: {this.state.signaltext}</Text>
                    </View>
                </Content>
            </Container>
        )
    }
}
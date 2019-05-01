import React, {Component} from 'react';
import {Alert, FlatList, Platform, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import MobilityAPI from '../../../Lib/MobilityAPI';
import {getFullScreenModalStyle, getHeaderStyle} from "../../../Helper/IphoneXHelper";
import {Button, Container, Content, Input, Left, List, ListItem, Right, Spinner} from 'native-base';
import RealmAPI from '../../../Lib/RealmAPI';
import MapComponentTmd from '../../../Components/Map/Small/MapComponentTmd';
import FullscreenMapComponentTmd from '../../../Components/Map/Fullscreen/FullscreenMapComponentTmd';
import TrackDetailsComponent from '../../../Components/Track/Details/TrackDetailsComponent';
import EditTrackDetailsComponent from '../../../Components/Track/TmdTrackEdit/EditTrackDetailsComponent';
import SplitTrackDetailsComponent from '../../../Components/Track/TmdTrackEdit/SplitTrackDetailsComponent';
import WaypointTrackDetailComponent from '../../../Components/Track/TmdTrackEdit/WaypointTrackDetailComponent';
import Menu from "../../../Components/Menu/Menu";
import Helper from '../../../Lib/HelperAPI';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import fontelloConfig from '../../../IconConfig/config.json';
import {styles} from '../../../Styles/GlobalStyles';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from "react-native-modal";
import RadioForm from 'react-native-simple-radio-button';

const Icon = createIconSetFromFontello(fontelloConfig);

var radio_props = [
    {label: 'Arbeitsplatz', value: 0},
    {label: 'Dienstlich/Geschäftlich', value: 1},
    {label: 'Schule/Ausbildung', value: 2},
    {label: 'Bringen/Holen/Begleiten von Personen', value: 3},
    {label: 'Einkauf', value: 4},
    {label: 'Private Erledigung', value: 5},
    {label: 'Privater Besuch', value: 6},
    {label: 'Freizeit', value: 7},
    {label: 'Anderer Zweck', value: 8},
];

export default class TmdTrackDetails extends Component {
    static navigationOptions = ({navigation}) => ({
        title: 'MEIN WEG',
        headerTitleStyle: {
            alignSelf: (Platform.OS === 'android') ? 'flex-end' : 'center',
            fontFamily: 'Hind-Medium',
            color: '#4e4e4e'
        },
        headerBackTitle: null,
        headerBackImage: require('../../../../resources/icons/icon_back.png'),
        headerStyle: getHeaderStyle()
    });


    constructor(props) {
        super(props);
        this.state = {
            title: 'Mein Weg',
            isDetailsCollapsed: false,
            isMyTrackMapCollapsed: false,
            name: this.props.navigation.state.params.item.name,
            track: this.props.navigation.state.params.item,
            editMode: false,
            isModalVisible: false,
            radiovalue: 8,
            editIconColor: '#8b8b8b',
            splitMode: false,
            splitIconColor: '#8b8b8b',
            intermediateStopMode: false,
            intermediateStopIconColor: '#8b8b8b',
            routeCoordinates: this.props.navigation.state.params.track,
            sections: this.props.navigation.state.params.track,
            isLoading: false,
            splitModeLoading: false,
            editModeLoading: false,
            intermediateStopModeLoading: false,
            showEdit: true,
            showSplit: true,
            isMapModalVisible: false
        };

    }


    async componentDidMount() {
        this.props.navigation.setParams({handleDelete: this.deleteTrack});
        this.setIsDeleting(false);
    }

    enterEditMode = async () => {
        await this.setState({
            editModeLoading: true
        });

        if (!this.state.editMode) {
            this.setState({
                editModeLoading: false,
                editIconColor: '#78D1C0',
                editMode: !this.state.editMode
            });
        } else {
            this.setState({isLoading: true});
            await RealmAPI.saveTmdTrackName(this.state.track, this.state.name);
            await this.updateChangesOnServer();
            this.props.navigation.state.params.refresh();
            this.setState({
                isLoading: false,
                editModeLoading: false,
                editIconColor: '#8b8b8b',
                editMode: !this.state.editMode
            });
        }
    };

    enterSplitMode = async () => {
        await this.setState({
            splitMode: !this.state.splitMode,
            splitModeLoading: true
        });

        if (this.state.splitMode) {
            this.setState({splitModeLoading: false});
            this.setState({splitIconColor: '#78D1C0'});
        } else {
            await RealmAPI.saveTmdTrackName(this.state.track, this.state.name);
            this.props.navigation.state.params.refresh();
            this.setState({splitModeLoading: false});
            this.setState({splitIconColor: '#8b8b8b'});
        }
    };

    enterIntermediateStopMode = async () => {
        await this.setState({
            intermediateStopModeLoading: true
        });

        if (!this.state.intermediateStopMode) {
            this.setState({
                intermediateStopModeLoading: false,
                intermediateStopIconColor: '#78D1C0',
                intermediateStopMode: !this.state.intermediateStopMode
            });
        } else {
            this.setState({isLoading: true});
            await RealmAPI.saveTmdTrackName(this.state.track, this.state.name);
            await this.updateChangesOnServer();
            this.props.navigation.state.params.refresh();
            this.setState({
                isLoading: false,
                intermediateStopModeLoading: false,
                intermediateStopIconColor: '#8b8b8b',
                intermediateStopMode: !this.state.intermediateStopMode
            });
        }
    };

    searchQuestionmarks() {
        for (var section in this.state.track.sections) {
            var curr = this.state.track.sections[section];

            if (curr.transportMode === "NOTDETECTED") {
                Alert.alert(
                    'Fehler',
                    'Der Track darf beim Freigeben keine Fragezeichen mehr enthalten!',
                    [
                        {text: 'OK'}
                    ],
                    {cancelable: false}
                );
                return true;
            }
        }
        return false;
    };

    onPressUpload = async () => {
        this.setState({isLoading: true});
        var res = !this.searchQuestionmarks();

        if (res) {
            res = await MobilityAPI.publish(this.state.track);
            if (res.success) {
                Alert.alert(
                    'Track hochgeladen',
                    res.data.message,
                    [
                        {
                            text: 'OK', onPress: () => this.deleteTrackLocally()
                        }
                    ],
                    {cancelable: false}
                );
            } else {
                console.warn(res.error.message);
                if (res.error.message === 'Request failed with status code 502') {
                    Alert.alert(
                        'Track hochgeladen',
                        'Der bearbeitete Track wurde freigegeben, jedoch konnte die Evaluierung nicht durchgeührt werden. ' +
                        'Der Track enthält deshalb keine Gesundheits-, Umwelt-, Kosten- und Zeitwerte.',
                        [
                            {text: 'OK', onPress: () => this.saveAndGoBackToAllTracks()}
                        ],
                        {cancelable: false}
                    );
                } else if (res.error.message === 'Network Error') {
                    Alert.alert('Verbindung fehlgeschlagen', 'Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut!');
                } else if (res.error.status === 401) {
                    Alert.alert('Unautorisiert', 'Bitte loggen Sie sich aus und erneut ein.');
                } else {
                    Alert.alert('Fehler', 'Der bearbeitete Track konnte nicht freigegeben werden. Bitte versuchen Sie es später erneut!');
                }
                this.setState({isLoading: false});
            }
        }
    };

    onPressSplit = async () => {
        this.setState({isLoading: true});
        var res = await MobilityAPI.splitTrack(this.state.track);
        if (res.success) {
            Alert.alert(
                'Track Splitten',
                'Der bearbeitete Track wurde erfolgreich gesplitted! Bitte synchronisieren Sie Ihre Tracks',
                [
                    {text: 'OK', onPress: () => this.finalDelete()}
                ],
                {cancelable: false}
            );
        } else {
            if (res.error.message === 'Network Error') {
                Alert.alert('Verbindung fehlgeschlagen', 'Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut!');
            } else if (res.error.response.status === 401) {
                Alert.alert('Unautorisiert', 'Bitte loggen Sie sich aus und erneut ein.');
            } else {
                Alert.alert('Fehler', 'Der bearbeitete Track konnte nicht gesplitted werden');
            }
            this.setState({isLoading: false});
        }
    };

    async saveAndGoBackToAllTracks() {
        await this.props.navigation.state.params.upgrade(this.state.track);
        this.props.navigation.goBack();
    }

    _toggleModal = () =>
        this.setState({isModalVisible: !this.state.isModalVisible});

    GoBackToAllTracks() {
        this.props.navigation.goBack();
    }

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

    async deleteTrackLocally() {
        //Track lokal löschen
        await this.props.navigation.state.params.remove(this.state.track);
        RealmAPI.deleteTmdTrack(this.state.track);
        this.props.navigation.goBack();
    }

    async finalDelete() {
        this.setIsDeleting(true);
        // force the update of the navigation
        this.forceUpdate();
        var res = await MobilityAPI.updateFinalTMDTrack(this.state.track, true, true);

        if (res.success) {
            //Track lokal löschen
            await this.props.navigation.state.params.remove(this.state.track);
            RealmAPI.deleteTmdTrack(this.state.track);
            this.props.navigation.goBack();
        } else {
            this.setIsDeleting(false);
            if (res.error.message === 'Network Error') {
                Alert.alert('Verbindung fehlgeschlagen', 'Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut!');
            } else if (res.error.response.status === 401) {
                Alert.alert('Unautorisiert', 'Bitte loggen Sie sich aus und erneut ein.');
            } else {
                Alert.alert('Löschen fehlgeschlagen', 'Leider ist beim Löschen etwas schiefgelaufen.')
            }
        }
    }

    setIsDeleting(value) {
        this.setState({isDeleting: value});
        this.props.navigation.setParams({isDeleting: this.state.isDeleting});
    }

    _toggleMapModal = () => {
        this.setState({isMapModalVisible: !this.state.isMapModalVisible});
    }

    getReason(radiovalue) {
        var text = "";
        switch (radiovalue) {
            case 0:
                text = "workplace";
                break;
            case 1:
                text = "business";
                break;
            case 2:
                text = "education";
                break;
            case 3:
                text = "bringing accompanying persons";
                break;
            case 4:
                text = "shopping";
                break;
            case 5:
                text = "private execution";
                break;
            case 6:
                text = "private visit";
                break;
            case 7:
                text = "leisure";
                break;
            case 8:
                text = "other purpose";
                break;
            default:
                text = "other purpose";
        }
        return text;
    }

    releasetrack = async (value) => {
        let text = this.getReason(value);
        this._toggleModal();
        await RealmAPI.saveTmdTrackReason(this.state.track, text);
        this.onPressUpload();
    };

    scrollDown = () => {
        setTimeout(() => {
            this.refs.scrollView.scrollToEnd({animated: true});
        }, 400);
    };

    async updateChangesOnServer() {
        var res = await MobilityAPI.updateFinalTMDTrack(this.state.track, false, false);
        if (res.success) {
        } else {
            if (res.error.message === 'Network Error') {
                Alert.alert('Verbindung fehlgeschlagen', 'Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut!');
            } else if (res.error.response.status === 401) {
                Alert.alert('Unautorisiert', 'Bitte loggen Sie sich aus und erneut ein.');
            } else {
                Alert.alert('Speichern fehlgeschlagen', 'Leider ist beim Speichern etwas schiefgelaufen.')
            }
        }
    }


    render() {
        const lastItem = this.state.sections[this.state.sections.length - 1];
        const tmpSections = this.state.sections.slice(0, this.state.sections.length - 1);
        var radio = this.state.isModalVisible ? <RadioForm
            radio_props={radio_props}
            initial={8}
            buttonSize={20}
            style={{alignItems: 'flex-start'}}
            buttonColor={'#78D1C0'}
            selectedButtonColor={'#78D1C0'}
            onPress={(value) => {
                this.setState({radiovalue: value})
            }}
        /> : null;
        return (
            <Container style={{backgroundColor: '#fff'}}>
                <Content contentContainerStyle={{backgroundColor: '#fff'}}>
                    <Modal isVisible={this.state.isModalVisible} onBackdropPress={() => this._toggleModal()}
                           onModalShow={this.scrollDown}>
                        <View style={styles.modalContent}>
                            <View style={{width: '100%'}}>
                                <Text style={{
                                    fontSize: 16,
                                    alignSelf: 'stretch',
                                    textAlign: 'left',
                                    fontWeight: 'bold',
                                    color: '#78D1C0'
                                }}>{'FREIGEBEN'}</Text>
                            </View>
                            <View style={{marginTop: 10, alignContent: 'center'}}>
                                <Text>{'Für welchen Zweck haben sie diesen Weg zurückgelegt? Bitte wählen sie eine der folgenden Optionen:'}</Text>
                            </View>
                            <View style={{borderTopColor: '#4c4e4f', borderTopWidth: 1, width: '100%', marginTop: 10}}/>
                            <ScrollView
                                ref="scrollView"
                                style={{height: 300,}}
                                showsHorizontalScrollIndicator={true}
                            >
                                {radio}
                            </ScrollView>
                            <View style={{
                                borderTopColor: '#4c4e4f',
                                borderTopWidth: 1,
                                width: '100%',
                                marginBottom: 10
                            }}/>
                            <View style={{
                                width: "100%",
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <TouchableOpacity style={{width: '50%'}} onPress={() => this._toggleModal()}>
                                    <View style={styles.modalbutton2}>
                                        <Text style={styles.buttonText}>{'ABBRECHEN'}</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={{width: '50%'}}
                                                  onPress={() => this.releasetrack(this.state.radiovalue)}>
                                    <View style={styles.modalbutton1}>
                                        <Text style={styles.buttonText}>{'FREIGEBEN'}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    <View style={{flexDirection: 'row'}}>
                        <Left style={{flexDirection: 'row', marginLeft: 20, marginTop: 16, marginBottom: 2}}>
                            <Text style={{
                                fontSize: 10,
                                marginLeft: 10,
                                marginRight: 10,
                                color: '#4e4e4e',
                                marginTop: 15,
                                fontFamily: 'Hind-SemiBold'
                            }}>NAME</Text>
                            <View style={{flexDirection: 'column', width: '80%'}}>
                                {this.state.editMode || this.state.splitMode || this.state.intermediateStopMode ?
                                    <Input
                                        multiline={true}
                                        value={this.state.name}
                                        style={{
                                            width: '100%',
                                            fontSize: 20,
                                            color: '#4e4e4e',
                                            backgroundColor: '#e0eeee'
                                        }}
                                        editable={this.state.editMode || this.state.splitMode || this.state.intermediateStopMode}
                                        onChangeText={(name) => this.setState({name: name})}
                                    /> : <Text style={{
                                        width: '100%',
                                        fontSize: 20,
                                        color: '#4e4e4e',
                                        marginLeft: 5,
                                        marginBottom: 10,
                                        marginTop: 7,
                                        fontFamily: 'Hind-SemiBold'
                                    }}>{this.state.name}</Text>}

                                <View style={{marginLeft: 8}}>
                                    {Helper.renderFormattedDate(this.state.track.date, "DD.MM.YYYY")}
                                </View>
                            </View>
                        </Left>
                        <Right>
                            <View style={{flexDirection: 'row', marginRight: 15, alignItems: 'center'}}>

                                <TouchableOpacity onPress={this.enterEditMode}
                                                  disabled={this.state.splitMode || this.state.intermediateStopMode}>
                                    {this.state.editModeLoading ? <Spinner color={'#78D1C0'}/>
                                        : <Icon name="icon_aendern" size={29} color={this.state.editIconColor}/>}
                                </TouchableOpacity>

                                <TouchableOpacity onPress={this.enterSplitMode}
                                                  disabled={this.state.editMode || this.state.intermediateStopMode}>
                                    {this.state.splitModeLoading ? <Spinner color={'#78D1C0'}/>
                                        : <Icon name="icon_splitten" size={29} color={this.state.splitIconColor}/>}
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.enterIntermediateStopMode}
                                                  disabled={this.state.splitMode || this.state.editMode}>
                                    {this.state.intermediateStopModeLoading ? <Spinner color={'#78D1C0'}/>
                                        : <MaterialIcon name="map-marker" size={29}
                                                        color={this.state.intermediateStopIconColor}/>}
                                </TouchableOpacity>
                            </View>
                        </Right>
                    </View>
                    <View style={{borderTopWidth: 1, borderTopColor: '#b8c1c1', margin: 14}}/>
                    <View>
                        {//Detailmode
                        }
                        {!this.state.editMode && !this.state.splitMode && !this.state.intermediateStopMode &&
                        <View>
                            <List contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
                                  dataArray={tmpSections}
                                  renderRow={(item) =>
                                      <TrackDetailsComponent section={item} navigation={this.props.navigation}
                                                             lastItem={false}/>
                                  }/>
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                <TrackDetailsComponent section={lastItem} navigation={this.props.navigation}
                                                       lastItem={true}/>
                            </View>
                        </View>
                        }
                        {//Editmode
                        }
                        {this.state.editMode && !this.state.splitMode && !this.state.intermediateStopMode &&
                        <View>
                            <List contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
                                  dataArray={tmpSections}
                                  renderRow={(item) =>
                                      <EditTrackDetailsComponent section={item}
                                                                 track={this.state.track}
                                                                 sections={this.state.sections}
                                                                 navigation={this.props.navigation}
                                                                 lastItem={false}/>
                                  }/>
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                <EditTrackDetailsComponent section={lastItem}
                                                           track={this.state.track}
                                                           sections={this.state.sections}
                                                           navigation={this.props.navigation}
                                                           lastItem={true}/>
                            </View>
                        </View>
                        }
                        {//Splitmode
                        }
                        {!this.state.editMode && this.state.splitMode && !this.state.intermediateStopMode &&
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <FlatList data={this.state.sections} keyExtractor={item => item}
                                      renderItem={({item, index}) =>
                                          <SplitTrackDetailsComponent section={item} track={this.state.track}
                                                                      sections={this.state.sections}
                                                                      navigation={this.props.navigation} index={index}/>
                                      }
                            />
                        </View>
                        }
                        {//Waypoint
                        }
                        {!this.state.editMode && !this.state.splitMode && this.state.intermediateStopMode &&
                        <View>
                            <List contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
                                  dataArray={tmpSections}
                                  renderRow={(item) =>
                                      <WaypointTrackDetailComponent section={item}
                                                                    track={this.state.track}
                                                                    sections={this.state.sections}
                                                                    navigation={this.props.navigation}
                                                                    lastItem={false}/>
                                  }/>
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                <WaypointTrackDetailComponent section={lastItem}
                                                              track={this.state.track}
                                                              sections={this.state.sections}
                                                              navigation={this.props.navigation}
                                                              lastItem={true}/>
                            </View>
                        </View>
                        }
                    </View>
                    <View style={{borderTopWidth: 1, borderTopColor: '#b8c1c1', margin: 14}}/>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        width: '100%',
                        marginTop: 10,
                        marginBottom: 10
                    }}>
                        <View style={{marginRight: 10, width: '40%'}}>
                            <Button style={styles.blueButton} full rounded primary
                                    onPress={this._toggleMapModal}>
                                {this.state.isLoading ? <Spinner color={'#ffffff'}/> :
                                    <Text style={styles.buttonText}>KARTE VERGRÖSSERN</Text>}
                            </Button>
                        </View>
                        <View style={{width: '33%'}}>
                            {!this.state.editMode && !this.state.splitMode && !this.state.intermediateStopMode &&
                            <Button style={styles.blueButton} full rounded primary onPress={this._toggleModal}>
                                {this.state.isLoading ? <Spinner color={'#ffffff'}/> :
                                    <Text style={styles.buttonText}>FREIGEBEN</Text>}
                            </Button>
                            }
                            {this.state.editMode && !this.state.splitMode && !this.state.intermediateStopMode &&
                            <Button style={styles.blueButton} full rounded primary onPress={this.enterEditMode}>
                                {this.state.isLoading ? <Spinner color={'#ffffff'}/> :
                                    <Text style={styles.buttonText}>SPEICHERN</Text>}
                            </Button>
                            }
                            {!this.state.editMode && this.state.splitMode && !this.state.intermediateStopMode &&
                            <Button style={styles.blueButton} full rounded primary onPress={this.onPressSplit}
                                    disabled={this.state.isLoading}>
                                {this.state.isLoading ? <Spinner color={'#ffffff'}/> :
                                    <Text style={styles.buttonText}>TRACK SPLITTEN</Text>}
                            </Button>
                            }
                            {!this.state.editMode && !this.state.splitMode && this.state.intermediateStopMode &&
                            <Button style={styles.blueButton} full rounded primary
                                    onPress={this.enterIntermediateStopMode}>
                                {this.state.isLoading ? <Spinner color={'#ffffff'}/> :
                                    <Text style={styles.buttonText}>SPEICHERN</Text>}
                            </Button>
                            }
                        </View>
                        <Icon onPress={this.deleteTrack} name="icon_papierkorb" size={30}
                              style={{marginRight: 20, marginLeft: 20, color: '#4e4e4e'}}/>
                    </View>
                    <View>
                        <MapComponentTmd track={this.state.track}/>
                    </View>
                    <View>
                        <Modal isVisible={this.state.isMapModalVisible}
                               onBackButtonPress={() => this._toggleMapModal()}
                        >
                            <View style={getFullScreenModalStyle()}>
                                <TouchableOpacity onPress={this._toggleMapModal} style={{backgroundColor: '#ffff'}}>
                                    <MaterialIcon name="arrow-left" size={25} color="black"/>
                                </TouchableOpacity>
                                <FullscreenMapComponentTmd track={this.state.track}/>
                            </View>
                        </Modal>
                    </View>
                </Content>
                <Menu navigation={this.props.navigation}/>
            </Container>
        )
    }
}

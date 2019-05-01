import React, {Component} from 'react';
import {Alert, Platform, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import MobilityAPI from '../../../Lib/MobilityAPI';
import {getFullScreenModalStyle, getHeaderStyle} from "../../../Helper/IphoneXHelper";
import {
    Button,
    Container,
    Content,
    Left,
    List,
    ListItem,
    Right,
    Spinner,
} from 'native-base';
import RealmAPI from '../../../Lib/RealmAPI';
import MapComponent from '../../../Components/Map/Small/MapComponent';
import MapComponentTmd from '../../../Components/Map/Small/MapComponentTmd';
import FullscreenMapComponent from '../../../Components/Map/Fullscreen/FullscreenMapComponent';
import FullscreenMapComponentTmd from '../../../Components/Map/Fullscreen/FullscreenMapComponentTmd';
import TrackDetailsComponent from '../../../Components/Track/Details/TrackDetailsComponent';
import Helper from '../../../Lib/HelperAPI';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import fontelloConfig from '../../../IconConfig/config.json';
import {styles} from '../../../Styles/GlobalStyles';
import Menu from "../../../Components/Menu/Menu";
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import EvaluationRouteComponent from "../../../Components/Route/EvaluationRouteComponent";
import Modal from "react-native-modal";


const Icon = createIconSetFromFontello(fontelloConfig);

export default class FinalTrackDetails extends Component {

    static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state;

        return {
            title: 'DETAILS WEG',
            headerTitleStyle: {
                alignSelf: (Platform.OS === 'android') ? 'flex-end' : 'center',
                fontFamily: 'Hind-Medium',
                color: '#4e4e4e'
            },
            headerBackTitle: null,
            headerBackImage: require('../../../../resources/icons/icon_back.png'),
            headerStyle: getHeaderStyle()
        }

    };


    async componentDidMount() {
        this.props.navigation.setParams({handleDelete: this.deleteTrack});
        this.setIsDeleting(false);
    }

    constructor(props) {
        super(props);
        this.state = {
            title: 'Details Weg',
            isDetailsCollapsed: false,
            isMyTrackMapCollapsed: false,
            name: this.props.navigation.state.params.item.name,
            track: this.props.navigation.state.params.item,
            editMode: false,
            icon: 'pencil',
            routeCoordinates: this.props.navigation.state.params.track,
            isTmd: false,
            sections: this.props.navigation.state.params.track,
            isDeleting: false,
            isModalVisible: false,
            isInfoModalVisible: false,
            isMapInfoModalVisible: false
        };
    }

    async componentWillMount() {
        var coordinates = this.props.navigation.state.params.track;

        var isTmd = false;

        if (coordinates[0].latitude == null) {
            isTmd = true;
        }

        this.setState({
            isTmd: isTmd,
            sections: coordinates
        });
    }

    _toggleModal = () =>
        this.setState({isModalVisible: !this.state.isModalVisible});

    onPressAlternatives = () => {
        //start = start von section 1
        var start = this.state.sections[0].start;
        //end = ende von letzter section
        var length = this.state.sections.length;
        var end = this.state.sections[length - 1].end;
        var via = '';
        for (var i = 0; i < length; i++) {
            if (this.state.sections[i].waypoint == true) {
                via = this.state.sections[i].start;
                i = length;
            }
        }

        //Goto PlanRoute Screen
        this.props.navigation.navigate({
            key: 'PlanRoute',
            routeName: 'PlanRoute',
            params: {start: start, end: end, via: via, showAlternatives: true}
        });
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
        this.setIsDeleting(true);
        //Flag auf dem Server setzen -->deletedByClient true
        var res = await MobilityAPI.updateFinalTMDTrack(this.state.track, true, true);

        if (res.success) {
            //Track lokal löschen
            await this.props.navigation.state.params.remove(this.state.track);
            RealmAPI.deleteTmdTrack(this.state.track);
            this.props.navigation.goBack();
        } else {
            this.setIsDeleting(false);

            Alert.alert(
                'Löschen fehlgeschlagen',
                'Leider konnte keine Verbndung zum Server hergestellt werden.'
            )
        }
    }

    setIsDeleting(value) {
        this.setState({isDeleting: value});
        this.props.navigation.setParams({isDeleting: this.state.isDeleting});
    }

    _toggleInfoModal = () => {
        this.setState({isInfoModalVisible: !this.state.isInfoModalVisible});
    }
    _toggleMapInfoModal = () => {
        this.setState({isMapInfoModalVisible: !this.state.isMapInfoModalVisible});
    }

    render() {
        const lastItem = this.state.sections[this.state.sections.length - 1];
        const tmpSections = this.state.sections.slice(0, this.state.sections.length - 1);

        return (
            <Container>
                <View>
                    <Modal isVisible={this.state.isInfoModalVisible} onBackdropPress={() => this._toggleInfoModal()}>
                        <View style={styles.modalContent}>
                            <Text style={{
                                fontSize: 16,
                                fontFamily: 'Hind-Bold',
                                color: '#4e4e4e',
                                marginTop: 10
                            }}>{'WAS BEDEUTEN DIE WERTE?'}</Text>
                            <ScrollView>
                                <View style={{margin: 10, alignContent: 'center'}}>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            marginRight: 20,
                                            fontFamily: 'Hind-Medium',
                                            color: '#4e4e4e'
                                        }}>{'Unter den Symbolen sehen Sie jeweils die Werte, die für diesen Weg berechnet wurden. ' +
                                    'Die Berechnung dieser Werte wird anhand der alternativen Wegen des aufgezeichneten Weges durchgeführt.'}</Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Icon name='icon_gesundheit'
                                          style={{fontSize: 20, color: '#FF5F7C', marginRight: 5}}/>
                                    <Text style={{
                                        fontSize: 14,
                                        marginBottom: 5,
                                        marginRight: 30,
                                        fontFamily: 'Hind-Medium',
                                        color: '#4e4e4e'
                                    }}>{'Je höher der Gesundheitswert (Werte zwischen 0 und 10), desto mehr tragen Sie zu Ihrer Gesundheit bei, wenn Sie diesen Weg wählen.'}</Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Icon name='icon_zeit'
                                          style={{fontSize: 20, color: '#FFC200', marginRight: 5}}/>
                                    <Text style={{
                                        fontSize: 14,
                                        marginRight: 30,
                                        fontFamily: 'Hind-Medium',
                                        color: '#4e4e4e'
                                    }}>{'Die Zeit gibt ca. an, wie lange Sie insgesamt für diesen Weg benötigen.'}</Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Icon name='icon_kosten'
                                          style={{fontSize: 20, color: '#78D1C0', marginRight: 5}}/>
                                    <Text style={{
                                        fontSize: 14,
                                        marginRight: 30,
                                        fontFamily: 'Hind-Medium',
                                        color: '#4e4e4e'
                                    }}>{'Dieser Wert gibt an, mit wie vielen Kosten Sie bei diesem Weg ungefähr rechnen müssen. ' +
                                    'Die Berechnung der Kosten erfolgt aufgrund von Durchschnittswerten in ganz Österreich/Schweiz/Deutschland. ' +
                                    'Die geschätzten Preise können also von den tatsächlichen Preisen abweichen.'}</Text>
                                </View>
                                <View style={{flexDirection: 'column'}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Icon name='icon_umwelt'
                                              style={{fontSize: 20, color: '#B0CE00', marginRight: 5}}/>
                                        <Text style={{
                                            fontSize: 14,
                                            marginBottom: 5,
                                            marginRight: 30,
                                            fontFamily: 'Hind-Medium',
                                            color: '#4e4e4e'
                                        }}>{'Für den Umwelt-Wert gilt, je weniger Punkte desto besser. ' +
                                        'Genauere Informationen erhalten Sie, indem Sie auf "Ein guter Tag hat 100 Punkte" klicken.'}</Text>
                                    </View>
                                </View>
                            </ScrollView>
                            <View style={{width: "100%"}}>
                                <TouchableOpacity onPress={this._toggleInfoModal}>
                                    <View style={styles.modalbutton1}>
                                        <Text style={styles.buttonText}>{'VERSTANDEN'}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
                <View>
                    <Modal isVisible={this.state.isMapInfoModalVisible}
                           onBackdropPress={() => this._toggleMapInfoModal()}>
                        <View style={styles.modalContent}>
                            <Text style={{
                                fontSize: 16,
                                fontFamily: 'Hind-Bold',
                                color: '#4e4e4e',
                                marginTop: 10
                            }}>{'WEGDARSTELLUNG AUF DER KARTE'}</Text>
                            <ScrollView>
                                <View style={{margin: 10, alignContent: 'center'}}>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            marginRight: 20,
                                            fontFamily: 'Hind-Medium',
                                            color: '#4e4e4e'
                                        }}>{'Der Weg wird in der Karte in unterschiedlichen Farben dargestellt.' +
                                    ' Welche Farbe angezeigt wird, hängt vom Transporttyp der jeweiligen Abschnitte ab.\n'}</Text>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                fontFamily: 'Hind-SemiBold',
                                                marginRight: 22,
                                                color: '#64a91b'
                                            }}>{'GRÜN'}</Text>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginRight: 65,
                                                fontFamily: 'Hind-Medium',
                                                color: '#4e4e4e'
                                            }}>{'kennzeichnet Abschnitte, die zu Fuß zurückgelegt wurden.'}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                fontFamily: 'Hind-SemiBold',
                                                marginRight: 26,
                                                color: '#2b52ff'
                                            }}>{'BLAU'}</Text>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginRight: 65,
                                                fontFamily: 'Hind-Medium',
                                                color: '#4e4e4e'
                                            }}>{'werden jene Abschnitte dargestellt, die mit dem Fahrrad zurückgelegt wurden.'}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                fontFamily: 'Hind-SemiBold',
                                                marginRight: 5,
                                                color: '#e78b17'
                                            }}>{'ORANGE'}</Text>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginRight: 65,
                                                fontFamily: 'Hind-Medium',
                                                color: '#4e4e4e'
                                            }}>{'werden Abschnitte, die mit öffentlichen Verkehrsmittel zurückgelegt wurden, angezeigt.'}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                fontFamily: 'Hind-SemiBold',
                                                marginRight: 32,
                                                color: '#ff1510'
                                            }}>{'ROT'}</Text>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginRight: 65,
                                                fontFamily: 'Hind-Medium',
                                                color: '#4e4e4e'
                                            }}>{'werden Abschnitte, die mit dem Auto zurückgelegt wurden, dargestellt.\n'}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginRight: 20,
                                                fontFamily: 'Hind-Medium',
                                                color: '#4e4e4e'
                                            }}>{'Stationäre Aufenthalte werden mit einem Marker auf der Karte angezeigt.'}</Text>
                                    </View>
                                </View>
                            </ScrollView>
                            <View style={{width: "100%"}}>
                                <TouchableOpacity onPress={this._toggleMapInfoModal}>
                                    <View style={styles.modalbutton1}>
                                        <Text style={styles.buttonText}>{'VERSTANDEN'}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
                <Content contentContainerStyle={{
                    backgroundColor: '#fff'
                }}>
                    <View style={{flexDirection: 'row'}}>
                        <Left style={{marginLeft: 20, marginTop: 16, marginBottom: 2}}>
                            <Text style={{
                                color: '#4e4e4e',
                                fontSize: 20,
                                fontFamily: 'Hind-SemiBold'
                            }}>{this.state.name}</Text>
                            {Helper.renderFormattedDate(this.state.track.date, "DD.MM.YYYY")}
                        </Left>
                        <Right style={{marginRight: 20, flexDirection: 'row', justifyContent: 'flex-end'}}>
                            <Button rounded primary style={{
                                width: 140,
                                backgroundColor: '#78D1C0',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 30
                            }} onPress={this.onPressAlternatives}>
                                <Text style={styles.buttonText}>ALTERNATIVEN</Text>
                            </Button>
                            <Icon onPress={this.deleteTrack} name="icon_papierkorb" size={27}
                                  style={{marginLeft: 10, color: '#4e4e4e'}}/>
                        </Right>
                    </View>
                    <View style={{borderTopWidth: 1, borderTopColor: '#b3bbbb', margin: 14}}/>
                    {this.state.isTmd &&
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
                    </View>}
                    <View style={{width: '100%', alignItems: 'flex-end'}}>
                        <TouchableOpacity
                            style={{
                                width: 17,
                                backgroundColor: '#4e4e4e',
                                borderRadius: 40,
                                marginRight: 30,
                                marginTop: 5,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onPress={() => this._toggleInfoModal()}>
                            <Text style={{fontSize: 12, color: '#fff'}}>?</Text>
                        </TouchableOpacity>

                    </View>
                    <EvaluationRouteComponent data={this.state.track.evaluation} route={false}/>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{flex: 1}}>{' '}</Text>
                        <View style={{flex: 15, width: '100%'}}>
                            <Button style={styles.blueButtonCenter} full rounded primary
                                    onPress={this._toggleModal}>
                                <Text style={styles.buttonText}>KARTE VERGRÖSSERN</Text>
                            </Button>
                        </View>
                        <View style={{flexDirection: 'row', height: 35, flex: 1}}>
                            <TouchableOpacity
                                style={{
                                    width: 17,
                                    height: 17,
                                    backgroundColor: '#4e4e4e',
                                    borderRadius: 40,
                                    marginRight: 30,
                                    marginTop: 5,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onPress={() => this._toggleMapInfoModal()}>
                                <Text style={{fontSize: 12, color: '#fff'}}>?</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <Modal isVisible={this.state.isModalVisible}
                               onBackButtonPress={() => this._toggleModal()}>
                            <View style={getFullScreenModalStyle()}>
                                <TouchableOpacity onPress={this._toggleModal} style={{backgroundColor: '#ffff'}}>
                                    <MaterialIcon name="arrow-left" size={25} color="black"/>
                                </TouchableOpacity>
                                {this.state.isTmd ? <FullscreenMapComponentTmd track={this.state.track}/> :
                                    <FullscreenMapComponent track={this.state.routeCoordinates}/>}
                            </View>
                        </Modal>
                    </View>
                    {this.state.isTmd ? <MapComponentTmd track={this.state.track}/> :
                        <MapComponent track={this.state.routeCoordinates}/>}
                </Content>
                <Menu navigation={this.props.navigation}/>
            </Container>
        )
    }
}

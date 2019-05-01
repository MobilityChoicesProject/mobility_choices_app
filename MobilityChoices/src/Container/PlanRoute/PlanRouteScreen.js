import React, {Component} from 'react';
import {Alert, FlatList, NetInfo, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {getHeaderStyle} from "../../Helper/IphoneXHelper";
import {
    Button,
    Container,
    Content,
    Form,
    Input,
    Item,
    ListItem,
    Spinner,
    Label
} from 'native-base';
import Moment from 'moment';
import MobilityAPI from '../../Lib/MobilityAPI';
import Modal from "react-native-modal";
import FinalRouteComponent from '../../Components/Route/FinalRouteComponent';
import DatePicker from 'react-native-datepicker';
import {styles} from '../../Styles/GlobalStyles';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import fontelloConfig from '../../IconConfig/config.json';
import Menu from "../../Components/Menu/Menu";
import Keys from "../../Lib/Keys";

const Icon = createIconSetFromFontello(fontelloConfig);

var {GooglePlacesAutocomplete} = require('react-native-google-places-autocomplete');

const DATETIME_FORMAT = 'DD.MM.YYYY HH:mm';
const QUERY_KEY = Keys.getQueryKey();

export default class PlanRouteScreen extends Component {
    static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state;

        return {
            title: 'ROUTE PLANEN',
            headerLeft:
                <Icon name='icon_routeplanen' size={27} style={{marginLeft: 20}} color='#4e4e4e'/>,
            headerRight:
                <TouchableOpacity
                    style={{
                        width: 17,
                        backgroundColor: '#4e4e4e',
                        borderRadius: 40,
                        marginRight: 10,
                        alignItems: 'center'
                    }}
                    onPress={() => params.handleModal()}>
                    <Text style={{fontSize: 12, color: '#fff'}}>?</Text>
                </TouchableOpacity>,
            headerTitleStyle: {fontFamily: 'Hind-Medium', color: '#4e4e4e'},
            headerStyle: getHeaderStyle()
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            title: 'Route Planen',
            start: '',
            end: '',
            via: '',
            timepickerDate: new Date(),
            dateChanged: false,
            loading: false,
            isConnected: true,
            isModalVisible: false
        };

        //initial network state
        NetInfo.isConnected.fetch().then(isConnected => {
            this.setState({isConnected});
        });
    }

    componentDidMount() {
        this.props.navigation.setParams({handleModal: this._toggleModal});
        this.componentWillReceiveProps(this.props);
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    }

    async componentWillReceiveProps(nextProps) {
        var showAlternatives = nextProps.navigation.state.params.showAlternatives;

        await this.setState({
            startObject: nextProps.navigation.state.params.start,
            endObject: nextProps.navigation.state.params.end,
            viaObject: nextProps.navigation.state.params.via,
            showAlternatives: showAlternatives
        });

        if (showAlternatives) {
            // https://github.com/FaridSafi/react-native-google-places-autocomplete/issues/155
            this.startAutoCompleteRef.setAddressText('');
            this.endAutoCompleteRef.setAddressText('');
            this.viaAutoCompleteRef.setAddressText('');

            await this.transformCoordinates();

            if (this.state.start != null && this.state.end != null) {
                this.searchRoute();
            } else {
                this.state.dataSource = [];

            }

            this.setState({showAlternatives: false});
        }
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    }


    handleConnectivityChange = isConnected => {
        if (isConnected) {
            this.setState({isConnected});
        } else {
            this.setState({isConnected});
        }
    };

    async transformCoordinates() {

        await this.setState({
            start: this.state.startObject.coordinates,
            end: this.state.endObject.coordinates,
        });

        if (this.state.viaObject != '') {
            await this.setState({
                via: this.state.viaObject.coordinates
            })
        } else {
            await this.setState({via: ''});
        }
    }

    searchRoute = async () => {
        await this.setState({
            loading: true,
            dataSource: []
        });

        if (this.state.isConnected == false) {
            Alert.alert('Verbindung fehlgeschlagen', 'Bitte überprüfen Sie Ihre Internetverbindung und/oder versuchen Sie es später nochmal!');
        } else {
            if (this.state.start == '' || this.state.end == '') {
                Alert.alert('Eingabefehler', 'Start und/oder Zielort eingeben!');
            } else {
                var date = null;
                if (this.state.dateChanged) {
                    date = this.getDateFromTimepicker().format("YYYY-MM-DD HH:mm");
                }
                var result = await MobilityAPI.getDirections(this.state.start, this.state.end, date, this.state.via);

                if (result.success) {
                    await this.setState({dataSource: result.data.routes})
                } else {
                    if (result.error.message === 'Network Error') {
                        Alert.alert('Verbindung fehlgeschlagen', 'Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut.');
                    } else if (result.error.response.status === 401) {
                        Alert.alert('Unautorisiert', 'Bitte loggen Sie sich aus und erneut ein.');
                    } else {
                        Alert.alert('Fehler', 'Bitte versuchen Sie es später nochmal.');
                    }
                }
            }
        }
        await this.setState({
            loading: false,
            showAlternatives: false
        });
    }

    _toggleModal = () => {
        this.setState({isModalVisible: !this.state.isModalVisible});
    }

    getDateFromTimepicker() {
        // convert the string to an date object
        return Moment(this.state.timepickerDate, DATETIME_FORMAT);
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
                                        }}>{'Neben den gefundenen Routen sehen Sie die Symbole für die Kategorien Gesundheit, Zeit, Kosten und Umwelt. ' +
                                    'Die Symbole können farbig, dunkelgrau oder hellgrau dargestellt werden. ' +
                                    'Wenn ein Symbol einer Kategorie farbig ist, bedeutet dies, dass diese Route in der entsprechenden Kategorie im Vergleich zu den möglichen Alternativen, ' +
                                    'die ebenfalls angezeigt werden, sehr gut ist. ' +
                                    'Wenn das Symbol dunkelgrau ist, ist die Route in dieser Kategorie weniger gut geeignet und ein hellgraues ' +
                                    'Symbol deutet darauf hin, dass es für diese Kategorie besser geeignete Routen gibt.'}</Text>
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
                                        }}>{'Dies bedeutet, dass die Route in Bezug auf die Umwelt und im Vergleich zu den alternativen Routen sehr umweltschonend ist.'}</Text>
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
                                        }}>{'Die Route ist in der Kategorie Umwelt zwar nicht schlecht im Vergleich zu den Alternativen, jedoch gibt es noch bessere Möglichkeiten.'}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <Icon name='icon_umwelt'
                                              style={{fontSize: 20, color: '#CFD9D9', marginRight: 5}}/>
                                        <Text style={{
                                            fontSize: 14,
                                            marginBottom: 5,
                                            marginRight: 20,
                                            fontFamily: 'Hind-Medium',
                                            color: '#4e4e4e'
                                        }}>{'Es gibt in Bezug auf den Umweltaspekt eindeutig bessere alternative Routen.'}</Text>
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
                    backgroundColor: '#fff'
                }}>
                    <View style={{alignItems: 'center'}}>
                        <View style={{width: '100%'}}>
                            <Form>
                                <Item inlineLabel style={{minHeight: 50}}>
                                    <Label style={styles.labelPlanRoute}>VON</Label>
                                    <GooglePlacesAutocomplete
                                        ref={(instance) => {
                                            this.startAutoCompleteRef = instance
                                        }}
                                        placeholder={this.state.startObject ? this.state.startObject.name : 'Startadresse'}
                                        minLength={2}
                                        autoFocus={false}
                                        returnKeyType={'default'}
                                        fetchDetails={true}
                                        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                                            this.setState({start: details.geometry.location});
                                        }}
                                        query={{
                                            // available options: https://developers.google.com/places/web-service/autocomplete
                                            key: QUERY_KEY,
                                            language: 'de', // language of the results
                                        }}
                                        styles={{
                                            textInputContainer: {
                                                backgroundColor: 'rgba(0,0,0,0)',
                                                borderTopWidth: 0,
                                                borderBottomWidth: 0
                                            },
                                            textInput: {
                                                marginLeft: 0,
                                                marginRight: 0,
                                                height: 38,
                                                color: '#8b8b8b',
                                                fontSize: 16,
                                                fontFamily: 'Hind-Medium'
                                            },
                                            predefinedPlacesDescription: {
                                                color: '#78D1C0'
                                            },
                                        }}
                                        currentLocation={true}
                                        currentLocationLabel="Aktuelle Position"
                                    />
                                </Item>
                                <Item inlineLabel style={{minHeight: 50,}}>
                                    <Label style={styles.labelPlanRoute}>NACH</Label>
                                    <GooglePlacesAutocomplete
                                        ref={(instance) => {
                                            this.endAutoCompleteRef = instance
                                        }}
                                        placeholder={this.state.endObject ? this.state.endObject.name : 'Zieladresse'}
                                        minLength={2}
                                        autoFocus={false}
                                        returnKeyType={'default'}
                                        fetchDetails={true}
                                        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                                            this.setState({end: details.geometry.location});
                                        }}
                                        query={{
                                            // available options: https://developers.google.com/places/web-service/autocomplete
                                            key: QUERY_KEY,
                                            language: 'de', // language of the results
                                        }}
                                        styles={{
                                            textInputContainer: {
                                                backgroundColor: 'rgba(0,0,0,0)',
                                                borderTopWidth: 0,
                                                borderBottomWidth: 0
                                            },
                                            textInput: {
                                                marginLeft: 0,
                                                marginRight: 0,
                                                height: 38,
                                                color: '#8b8b8b',
                                                fontSize: 16,
                                                fontFamily: 'Hind-Medium'
                                            },
                                            predefinedPlacesDescription: {
                                                color: '#78D1C0'
                                            },
                                        }}
                                        currentLocation={false}
                                    />
                                </Item>
                                <Item inlineLabel style={{minHeight: 50,}}>
                                    <Label style={styles.labelPlanRoute}>VIA</Label>
                                    <GooglePlacesAutocomplete
                                        ref={(instance) => {
                                            this.viaAutoCompleteRef = instance
                                        }}
                                        placeholder={this.state.viaObject ? this.state.viaObject.name : 'Adresse via'}
                                        minLength={2}
                                        autoFocus={false}
                                        returnKeyType={'default'}
                                        fetchDetails={true}
                                        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                                            this.setState({via: details.geometry.location});
                                        }}
                                        query={{
                                            // available options: https://developers.google.com/places/web-service/autocomplete
                                            key: QUERY_KEY,
                                            language: 'de', // language of the results
                                        }}
                                        styles={{
                                            textInputContainer: {
                                                backgroundColor: 'rgba(0,0,0,0)',
                                                borderTopWidth: 0,
                                                borderBottomWidth: 0
                                            },
                                            textInput: {
                                                marginLeft: 0,
                                                marginRight: 0,
                                                height: 38,
                                                color: '#8b8b8b',
                                                fontSize: 16,
                                                fontFamily: 'Hind-Medium'
                                            },
                                            predefinedPlacesDescription: {
                                                color: '#78D1C0'
                                            },
                                        }}
                                        currentLocation={false}
                                    />
                                </Item>
                            </Form>
                            <ListItem>
                                <Label style={styles.labelPlanRoute}>ZEIT</Label>

                                <DatePicker
                                    date={this.state.timepickerDate}
                                    mode="datetime"
                                    format={DATETIME_FORMAT}
                                    confirmBtnText="OK"
                                    cancelBtnText="Abbrechen"
                                    style={{width: 200, marginTop: 9, marginLeft: 7}}
                                    customStyles={{
                                        dateIcon: {
                                            marginRight: 25
                                        },
                                        dateInput: {
                                            borderWidth: 0
                                        }
                                    }}
                                    onDateChange={(date) => {
                                        this.setState({timepickerDate: date, dateChanged: true})
                                    }}
                                    iconComponent={<Icon name="icon_kalender" size={27} color="#4e4e4e"/>}/>

                            </ListItem>
                        </View>
                        <View style={{width: '80%', marginTop: 20, marginBottom: 20}}>
                            <Button style={styles.blueButton} full rounded primary onPress={this.searchRoute}>
                                <Text style={styles.buttonText}>VORSCHLÄGE ANZEIGEN</Text>
                                {this.state.loading ? <Spinner color={'#fff'}/> : null}
                            </Button>
                        </View>
                    </View>

                    <FlatList
                        keyExtractor={(item, i) => (new Date()).getTime() * Math.random() /* the item does not possess a unique id */}
                        data={this.state.dataSource}
                        extraData={this.state.dataSource ? this.state.dataSource.length : null}
                        automaticallyAdjustContentInsets={false}
                        renderItem={({item}) =>
                            <FinalRouteComponent track={item} navigation={this.props.navigation}/>
                        }
                    />
                </Content>
                <Menu navigation={this.props.navigation}/>
            </Container>
        )
    }
}

import React, {Component} from 'react';
import {Alert, FlatList, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {getHeaderStyle} from "../../Helper/IphoneXHelper";
import {
    Body,
    Button,
    Container,
    Content,
    Item,
    Label,
    Left,
    ListItem,
    Picker
} from 'native-base';
import RealmAPI from '../../Lib/RealmAPI';
import MobilityAPI from '../../Lib/MobilityAPI';
import ObjectHelper from '../../Helper/ObjectHelper';
import TransportComponent from '../../Components/Profile/TransportComponent';
import PreferenceComponent from '../../Components/Profile/PreferenceComponent';
import UserDataComponent from '../../Components/Profile/UserDataComponent';
import {styles} from '../../Styles/GlobalStyles';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import fontelloConfig from '../../IconConfig/config.json';
import Menu from "../../Components/Menu/Menu";
import Modal from "react-native-modal";
import UserGroupComponent from '../../Components/Profile/UserGroupComponent';
import ComponentHelper from "../../Helper/ComponentHelper";

const Icons = createIconSetFromFontello(fontelloConfig);


export default class ProfileScreen extends Component {
    static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state;

        return {
            title: 'PROFIL',
            headerLeft:
                <Icons name='icon_meinprofil' size={27} style={{marginLeft: 20}} color='#4e4e4e'/>,
            headerStyle: getHeaderStyle(),
            headerTitleStyle: {fontFamily: 'Hind-Medium', color: '#4e4e4e'}
        }
    };

    initialized = false;

    constructor(props) {
        super(props);
        this.state = {
            isUserdataCollapsed: false,
            isPreferencesCollapsed: false,
            isMytransportsCollapsed: false,
            title: 'Profil',
            email: '',
            myProfile: {},
            changedProfile: false,
            isModalVisible: false,
            UserGroupsForProfile: [],
            refresh: false
        };
    }

    async handleValue(value, valueName) {
        this.setState({changedProfile: true});
        await ComponentHelper.updateObjectStateValue(this.state.myProfile, value, 'myProfile', valueName, 'changedProfile');
    }

    updateBikeValue = async (value) => {
        this.handleValue(value, 'bikeThreshold');
    };
    updateFootValue = (value) => {
        this.handleValue(value, 'footThreshold');
    };
    updateChangeTrainValue = async (value) => {
        this.handleValue(value, 'changeTrainThreshold');
    };
    updateWaitingTimeValue = async (value) => {
        this.handleValue(value, 'waitingTimeThreshold');
    };
    updateFootToStationValue = async (value) => {
        this.handleValue(value, 'footToStationThreshold');
    };
    updateBikeToStationValue = async (value) => {
        this.handleValue(value, 'bikeToStationThreshold');
    };

    async componentWillMount() {
        var loginData = RealmAPI.getLoginData();
        await this.setState({email: loginData.email});

        //load local profile
        RealmAPI.loadProfile(this.state.email).then(async profile => {
            if (profile.success) {
                var myData = await ObjectHelper.copyProperties(profile.data);
                this.setState({myProfile: myData});
                this.shouldComponentUpdate = true;
                this.initialized = true;
                this.forceUpdate();
            }
        });
    }

    // other methods
    save = async () => {
        //save profile locale
        RealmAPI.createOrUpdateProfile(this.state.myProfile);

        //sync profile with sever
        MobilityAPI.updateProfile(this.state.myProfile).then(res => {
            if (res.success == true) {
                var profile = res.data;
                profile.alreadySynced = true;
                this.setState({myProfile: profile});
                Alert.alert('Änderungen gespeichert', 'Ihre Änderungen im Profil wurden erfolgreich gespeichert.');
            } else if (res.error.response.status === 401) {
                Alert.alert('Unautorisiert', 'Bitte loggen Sie sich aus und erneut ein.');
            } else {
                var profile = this.state.myProfile;
                profile.alreadySynced = false;
                Alert.alert('Änderungen lokal gespeichert.', 'Keine Internetverbindung zum synchronisieren. Versuchen Sie es später nochmal.');
                this.setState({
                    myProfile: profile,
                    changedProfile: true
                });
            }
        });
        this.setState({changedProfile: false});
    };

    toggleUserDataCollapsible = () => {
        this.setState({isUserdataCollapsed: !this.state.isUserdataCollapsed})
    };

    togglePreferencesCollapsible = () => {
        this.setState({isPreferencesCollapsed: !this.state.isPreferencesCollapsed})
    };

    toggleMyTransports = () => {
        this.setState({isMytransportsCollapsed: !this.state.isMytransportsCollapsed});
    };

    openThresholdScreen = () => {
        this.props.navigation.navigate({
            key: 'Threshold', routeName: 'Threshold', params: {
                profile: this.state.myProfile,
                self: this
            }
        })
    };

    _toggleModal = async () => {
        if (!this.state.isModalVisible == true) {
            var n = await this.loadUserGroups();
            await this.setState({UserGroupsForProfile: n});
            await this.setState({refresh: !this.state.refresh});

        }
        this.setState({isModalVisible: !this.state.isModalVisible});
    };

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#CED0CE",
                }}
            />
        );
    };

    loadUserGroups = async () => {
        var usergroupsresponse = await MobilityAPI.getUserGroupsForUser();
        if (usergroupsresponse.data.error == false) {
            console.warn(usergroupsresponse.data.data);
            await RealmAPI.saveUsergroups(usergroupsresponse.data.data);
            return (usergroupsresponse.data.data);
        } else {
            return null;
        }
    };

    updateUserGroups = async () => {
        try {
            var realmObj = await RealmAPI.getUsergroups();
            var obj = await ObjectHelper.deepCopyRealm({}, realmObj);
            var response = await MobilityAPI.updateUserGroupsForUser(Object.values(obj));
            console.log(response);
            if (response.success == true) {
                Alert.alert(
                    'Hinweis',
                    'Nutzergruppen wurden aktualisiert.',
                    [
                        {text: 'OK', onPress: () => this._toggleModal()}
                    ],
                    {cancelable: false}
                );
            } else {
                if (response.error.message === 'Network Error') {
                    Alert.alert('Verbindung fehlgeschlagen', 'Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut!', [
                            {text: 'OK', onPress: () => this._toggleModal()}
                        ],
                        {cancelable: false}
                    );
                } else {
                    Alert.alert('Fehler', 'Nutzergruppen konnten nicht aktualisiert werden.', [
                            {text: 'OK', onPress: () => this._toggleModal()}
                        ],
                        {cancelable: false}
                    );
                }
            }
        } catch (error) {
            console.log("Error loading data" + error);
        }
    };

    render() {
        return (
            <Container>
                <View>
                    <Modal isVisible={this.state.isModalVisible} onBackButtonPress={() => this._toggleModal()}>
                        <View style={{
                            flex: 1,
                            width: '100%',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            backgroundColor: "white",
                            alignItems: 'center',
                            padding: 22,
                            borderRadius: 4,
                            borderColor: 'rgba(0, 0, 0, 0.1)'
                        }}>
                            <Text style={{
                                fontSize: 26,
                                color: '#4e4e4e',
                                fontFamily: 'Hind-Bold'
                            }}>{'NUTZERGRUPPEN'}</Text>
                            <View style={{borderTopColor: '#CED0CE', borderTopWidth: 1, width: '100%', marginTop: 10}}/>
                            <ScrollView style={{width: '100%', height: 200}}>
                                <FlatList data={this.state.UserGroupsForProfile}
                                          keyExtractor={(item, index) => index}
                                          ItemSeparatorComponent={this.renderSeparator}
                                          style={{width: '100%'}}
                                          extraData={this.state.refresh}
                                          renderItem={({item, index}) =>
                                              <UserGroupComponent group={item}
                                                                  groupindex={index}
                                                                  usergroups={this.state.UserGroupsForProfile}
                                                                  navigation={this.props.navigation}/>
                                          }
                                />
                            </ScrollView>
                            <View style={{
                                borderTopColor: '#CED0CE',
                                borderTopWidth: 1,
                                width: '100%',
                                marginBottom: 10
                            }}/>
                            <View style={{width: "100%"}}>
                                <TouchableOpacity onPress={this.updateUserGroups}>
                                    <View style={styles.modalbutton1}>
                                        <Text style={styles.buttonText}>{'AKTUALISIEREN'}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
                <Content contentContainerStyle={{
                    backgroundColor: '#fff'
                }}>
                    <ListItem style={styles.listItem} itemDivider>
                        <Text style={styles.profileHeadings}>BENUTZERDATEN</Text>
                    </ListItem>
                    <UserDataComponent self={this} state={this.state} navigation={this.props.navigation}/>
                    <ListItem style={styles.listItem} itemDivider>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text
                                style={{
                                    color: '#8b8b8b',
                                    fontFamily: 'Hind-SemiBold',
                                    fontSize: 10,
                                    marginBottom: 15
                                }}>NUTZERGRUPPEN</Text>
                            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
                                <Button style={styles.Button80} full rounded primary onPress={this._toggleModal}>
                                    <Text style={styles.buttonText}>NUTZERGRUPPEN DEFINIEREN</Text>
                                </Button>
                            </View>
                        </View>
                    </ListItem>
                    <ListItem style={styles.listItem} itemDivider>
                        <Text style={styles.profileHeadings}>PRÄFERENZEN</Text>
                    </ListItem>
                    <PreferenceComponent self={this} state={this.state}/>
                    <ListItem style={styles.listItem} itemDivider>
                        <Body>
                        <Text style={styles.profileHeadings}>MEINE VERKEHRSMITTEL</Text>
                        </Body>
                    </ListItem>
                    <TransportComponent self={this} state={this.state}/>

                    <ListItem style={styles.listItem} itemDivider>
                        <Text style={styles.profileHeadings}>SCHWELLWERTE</Text>
                    </ListItem>
                    <ListItem itemDivider icon style={{backgroundColor: '#fff'}}>
                        <Left>
                            <Icons name="icon_verkehrsmittel_zufuss" size={26} color="black"/>
                        </Left>
                        <Body>
                        <Text style={{fontFamily: 'Hind-SemiBold', fontSize: 14, color: "#4e4e4e", marginLeft: '8%'}}>
                            Zu Fuss </Text>
                        </Body>
                    </ListItem>
                    <ListItem inlineLabel
                              style={{flex: 1, flexDirection: 'row', borderBottomWidth: 1, borderTopWidth: 1}}>
                        <Label style={styles.tresholdLabel}>MAXIMALE WEGLÄNGE</Label>
                        <Picker
                            style={{flex: 0.3}}
                            supportedOrientations={['portrait', 'landscape']}
                            iosHeader="Maximale Weglänge"
                            mode="dropdown"
                            selectedValue={ObjectHelper.getValueOrDefaultString(this.state.myProfile.footThreshold)}
                            onValueChange={this.updateFootValue}>
                            <Item label="1 km" value="1"/>
                            <Item label="2 km" value="2"/>
                            <Item label="3 km" value="3"/>
                            <Item label="4 km" value="4"/>
                            <Item label="5 km" value="5"/>
                            <Item label="6 km" value="6"/>
                            <Item label="7 km" value="7"/>
                            <Item label="8 km" value="8"/>
                            <Item label="9 km" value="9"/>
                            <Item label="10 km" value="10"/>
                            <Item label="11 km" value="11"/>
                            <Item label="12 km" value="12"/>
                            <Item label="13 km" value="13"/>
                            <Item label="14 km" value="14"/>
                            <Item label="15 km" value="15"/>
                            <Item label="16 km" value="16"/>
                            <Item label="17 km" value="17"/>
                            <Item label="18 km" value="18"/>
                            <Item label="19 km" value="19"/>
                            <Item label="20 km" value="20"/>
                            <Item label="21 km" value="21"/>
                            <Item label="22 km" value="22"/>
                            <Item label="23 km" value="23"/>
                            <Item label="24 km" value="24"/>
                            <Item label="25 km" value="25"/>
                        </Picker>
                    </ListItem>
                    <ListItem itemDivider icon style={{backgroundColor: '#fff', marginTop: 40}}>
                        <Left>
                            <Icons name="icon_verkehrsmittel_fahrrad" size={26} color="black"/>
                        </Left>
                        <Body>
                        <Text style={{fontFamily: 'Hind-SemiBold', fontSize: 14, color: "#4e4e4e"}}> Fahrrad </Text>
                        </Body>
                    </ListItem>
                    <ListItem inlineLabel
                              style={{flex: 1, flexDirection: 'row', borderBottomWidth: 1, borderTopWidth: 1}}>
                        <Label style={styles.tresholdLabel}>MAXIMALE WEGLÄNGE</Label>
                        <Picker
                            style={{flex: 0.3}}
                            supportedOrientations={['portrait', 'landscape']}
                            iosHeader="Maximale Weglänge"
                            mode="dropdown"
                            selectedValue={ObjectHelper.getValueOrDefaultString(this.state.myProfile.bikeThreshold)}
                            onValueChange={this.updateBikeValue}>
                            <Item label="1 km" value="1"/>
                            <Item label="2 km" value="2"/>
                            <Item label="3 km" value="3"/>
                            <Item label="4 km" value="4"/>
                            <Item label="5 km" value="5"/>
                            <Item label="6 km" value="6"/>
                            <Item label="7 km" value="7"/>
                            <Item label="8 km" value="8"/>
                            <Item label="9 km" value="9"/>
                            <Item label="10 km" value="10"/>
                            <Item label="11 km" value="11"/>
                            <Item label="12 km" value="12"/>
                            <Item label="13 km" value="13"/>
                            <Item label="14 km" value="14"/>
                            <Item label="15 km" value="15"/>
                            <Item label="16 km" value="16"/>
                            <Item label="17 km" value="17"/>
                            <Item label="18 km" value="18"/>
                            <Item label="19 km" value="19"/>
                            <Item label="20 km" value="20"/>
                            <Item label="21 km" value="21"/>
                            <Item label="22 km" value="22"/>
                            <Item label="23 km" value="23"/>
                            <Item label="24 km" value="24"/>
                            <Item label="25 km" value="25"/>
                        </Picker>
                    </ListItem>
                    <ListItem itemDivider icon style={{backgroundColor: '#fff', marginTop: 40}}>
                        <Left>
                            <Icons name="icon_verkehrsmittel_bahn" size={26} color="black"/>
                        </Left>
                        <Left>
                            <Icons name="icon_verkehrsmittel_bus" size={24} color="black"/>
                        </Left>
                        <Left>
                            <Icons name="icon_verkehrsmittel_strassenbahn" size={26} color="black"/>
                        </Left>
                        <Body>
                        <Text style={{fontFamily: 'Hind-SemiBold', fontSize: 14, color: "#4e4e4e"}}> Öffentliche
                            Verkehrsmittel </Text>
                        </Body>
                    </ListItem>
                    <ListItem inlineLabel
                              style={{flex: 1, flexDirection: 'row', borderBottomWidth: 1, borderTopWidth: 1}}>
                        <Label style={styles.tresholdLabel}>MAXIMALE ANZAHL DER UMSTIEGE</Label>
                        <Picker
                            style={{flex: 0.3}}
                            supportedOrientations={['portrait', 'landscape']}
                            iosHeader="Maximale Anzahl der Umstiege"
                            mode="dropdown"
                            selectedValue={ObjectHelper.getValueOrDefaultString(this.state.myProfile.changeTrainThreshold)}
                            onValueChange={this.updateChangeTrainValue}>
                            <Item label="1" value="1"/>
                            <Item label="2" value="2"/>
                            <Item label="3" value="3"/>
                            <Item label="4" value="4"/>
                            <Item label="5" value="5"/>
                            <Item label="6" value="6"/>
                            <Item label="7" value="7"/>
                            <Item label="8" value="8"/>
                            <Item label="9" value="9"/>
                            <Item label="10" value="10"/>
                            <Item label="11" value="11"/>
                            <Item label="12" value="12"/>
                            <Item label="13" value="13"/>
                            <Item label="14" value="14"/>
                            <Item label="15" value="15"/>
                        </Picker>
                    </ListItem>
                    <ListItem inlineLabel style={{flex: 1, flexDirection: 'row', borderBottomWidth: 1}}>
                        <Label style={styles.tresholdLabel}>MAXIMALE WARTEZEIT</Label>
                        <Picker
                            style={{flex: 0.3}}
                            supportedOrientations={['portrait', 'landscape']}
                            iosHeader="Maximale Wartezeit"
                            mode="dropdown"
                            selectedValue={ObjectHelper.getValueOrDefaultString(this.state.myProfile.waitingTimeThreshold)}
                            onValueChange={this.updateWaitingTimeValue}>
                            <Item label="5 min" value="5"/>
                            <Item label="10 min" value="10"/>
                            <Item label="20 min" value="20"/>
                            <Item label="30 min" value="30"/>
                            <Item label="45 min" value="45"/>
                            <Item label="60 min" value="60"/>
                            <Item label="> 60 min" value="300"/>
                        </Picker>
                    </ListItem>
                    <ListItem inlineLabel style={{flex: 1, flexDirection: 'row', borderBottomWidth: 1}}>
                        <Label style={styles.tresholdLabel}>MAXIMALE WEGLÄNGE ZUR HALTESTELLE ZU FUSS</Label>
                        <Picker
                            style={{flex: 0.3}}
                            supportedOrientations={['portrait', 'landscape']}
                            iosHeader="Maximale Weglänge zur Haltestelle zu Fuss"
                            mode="dropdown"
                            selectedValue={ObjectHelper.getValueOrDefaultString(this.state.myProfile.footToStationThreshold)}
                            onValueChange={this.updateFootToStationValue}>
                            <Item label="1 km" value="1"/>
                            <Item label="2 km" value="2"/>
                            <Item label="3 km" value="3"/>
                            <Item label="4 km" value="4"/>
                            <Item label="5 km" value="5"/>
                            <Item label="6 km" value="6"/>
                            <Item label="7 km" value="7"/>
                            <Item label="8 km" value="8"/>
                            <Item label="9 km" value="9"/>
                            <Item label="10 km" value="10"/>
                            <Item label="11 km" value="11"/>
                            <Item label="12 km" value="12"/>
                            <Item label="13 km" value="13"/>
                            <Item label="14 km" value="14"/>
                            <Item label="15 km" value="15"/>
                            <Item label="16 km" value="16"/>
                            <Item label="17 km" value="17"/>
                            <Item label="18 km" value="18"/>
                            <Item label="19 km" value="19"/>
                            <Item label="20 km" value="20"/>
                            <Item label="21 km" value="21"/>
                            <Item label="22 km" value="22"/>
                            <Item label="23 km" value="23"/>
                            <Item label="24 km" value="24"/>
                            <Item label="25 km" value="25"/>
                        </Picker>
                    </ListItem>
                    <ListItem inlineLabel style={{flex: 1, flexDirection: 'row', borderBottomWidth: 1}}>
                        <Label style={styles.tresholdLabel}>MAXIMALE WEGLÄNGE ZUR HALTESTELLE PER FAHRRAD</Label>
                        <Picker
                            style={{flex: 0.3}}
                            supportedOrientations={['portrait', 'landscape']}
                            iosHeader="Maximale Weglänge zur Haltestelle per Fahrrad"
                            mode="dropdown"
                            selectedValue={ObjectHelper.getValueOrDefaultString(this.state.myProfile.bikeToStationThreshold)}
                            onValueChange={this.updateBikeToStationValue}>
                            <Item label="1 km" value="1"/>
                            <Item label="2 km" value="2"/>
                            <Item label="3 km" value="3"/>
                            <Item label="4 km" value="4"/>
                            <Item label="5 km" value="5"/>
                            <Item label="6 km" value="6"/>
                            <Item label="7 km" value="7"/>
                            <Item label="8 km" value="8"/>
                            <Item label="9 km" value="9"/>
                            <Item label="10 km" value="10"/>
                            <Item label="11 km" value="11"/>
                            <Item label="12 km" value="12"/>
                            <Item label="13 km" value="13"/>
                            <Item label="14 km" value="14"/>
                            <Item label="15 km" value="15"/>
                            <Item label="16 km" value="16"/>
                            <Item label="17 km" value="17"/>
                            <Item label="18 km" value="18"/>
                            <Item label="19 km" value="19"/>
                            <Item label="20 km" value="20"/>
                            <Item label="21 km" value="21"/>
                            <Item label="22 km" value="22"/>
                            <Item label="23 km" value="23"/>
                            <Item label="24 km" value="24"/>
                            <Item label="25 km" value="25"/>
                        </Picker>
                    </ListItem>

                </Content>
                {this.state.changedProfile &&
                <View style={{flexDirection: 'row', justifyContent: 'center', height: 35, backgroundColor: 'white'}}>
                    <Button style={styles.saveButton} full rounded primary onPress={this.save}>
                        <Text style={styles.buttonText}>ÄNDERUNGEN ÜBERNEHMEN</Text>
                    </Button>
                </View>
                }
                <Menu navigation={this.props.navigation}/>
            </Container>
        );
    }
}

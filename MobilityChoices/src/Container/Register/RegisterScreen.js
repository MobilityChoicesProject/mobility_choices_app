import React, {Component} from 'react';
import {Alert, Image, KeyboardAvoidingView, NetInfo, Platform, View} from 'react-native';
import MobilityAPI from '../../Lib/MobilityAPI';
import RealmAPI from '../../Lib/RealmAPI';
import {getHeaderStyle} from "../../Helper/IphoneXHelper";
import {
    Button,
    Container,
    Content,
    Form,
    Header,
    Icon,
    Input,
    Item,
    Label,
    Left,
    Picker,
    Right,
    StyleProvider,
    Text,
    Title
} from 'native-base';
import {NavigationActions} from 'react-navigation';
import {styles} from '../../Styles/GlobalStyles';

var {GooglePlacesAutocomplete} = require('react-native-google-places-autocomplete');


const resetAction = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({routeName: 'Login'})
    ]
})

export default class RegisterScreen extends Component {
    static navigationOptions = ({navigation}) => ({
        title: 'REGISTRIERUNG',
        headerTitleStyle: {
            alignSelf: (Platform.OS === 'android') ? 'flex-end' : 'center',
            fontFamily: 'Hind-Medium',
            color: '#4e4e4e'
        },
        headerBackTitle: null,
        headerBackImage: require('../../../resources/icons/icon_back.png'),
        headerStyle: getHeaderStyle()
    });

    constructor(props) {
        super(props);
        this.state = {
            title: 'Registrierung',
            email: '',
            password: '',
            passwordRepeat: '',
            persona: 'time',
            isConnected: null,
            country: 'AT',
            gender: 'male',
            myProfile: '',
            age: 0,
            city: ''
        };
    }

    resetRegister = (profilevalue) => {
        return this.props
            .navigation
            .dispatch(NavigationActions.reset(
                {
                    index: 0,
                    actions: [
                        NavigationActions.navigate({
                            key: 'Start',
                            routeName: 'Start',
                            params: {profile: profilevalue}
                        })
                    ]
                }));
    };

    validateEmail = (email) => {
        var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
        return re.test(email);
    };

    performRegister = async () => {
        if (this.state.email != '') {
            if (this.validateEmail(this.state.email)) {
                if (this.state.password != '') {
                    if (this.state.password.length >= 5) {
                        if (this.state.password === this.state.passwordRepeat) {
                            if (this.state.age > 15) {
                                if (this.state.city != '') {
                                    MobilityAPI.register(this.state.email.trim(), this.state.password).then(response => {
                                        if (response.success) {
                                            MobilityAPI.login(this.state.email.trim(), this.state.password).then(res => {
                                                if (res.success) {
                                                    Alert.alert('Erfolgreich registriert', 'Eine Email zum Verifizieren des Accounts wurde an Sie gesendet.');
                                                    RealmAPI.createDefaultProfile(this.state.email.trim(), this.state.country, this.state.gender, this.state.age, this.state.city).then(async (value) => {
                                                        this.setState({myProfile: value});
                                                        await MobilityAPI.createProfile(value, this.state.email.trim());
                                                        //this.props.navigation.navigate({key:'Time', routeName: 'Time', params: {profile: value.data}});
                                                        this.resetRegister(value.data);
                                                    });
                                                } else {
                                                    Alert.alert('Login fehlgeschlagen!', 'Bitte überprüfe deine Eingaben.');
                                                    this.props.navigation.dispatch(resetAction);
                                                }
                                            });
                                        } else {
                                            if (response.error.response.status === 422) {
                                                Alert.alert('Registrierung fehlgeschlagen!', 'Email wird bereits verwendet.');
                                            } else {
                                                Alert.alert('Registrierung fehlgeschlagen!', 'Bitte überprüf deine Internetverbindung.');
                                            }
                                        }
                                    });
                                } else {
                                    Alert.alert('Registrierung fehlgeschlagen!', 'Es muss ein Heimatort angegeben werden.');
                                }
                            } else {
                                Alert.alert('Registrierung fehlgeschlagen!', 'Sie müssen mindestens 15 Jahre alt sein.');
                            }
                        } else {
                            Alert.alert('Registrierung fehlgeschlagen!', 'Passwörter stimmen nicht überein.');
                        }
                    } else {
                        Alert.alert('Registrierung fehlgeschlagen!', 'Passwort muss länger als 4 Zeichen sein.');
                    }
                } else {
                    Alert.alert('Registrierung fehlgeschlagen!', 'Passwort ist leer.');
                }
            } else {
                Alert.alert('Registrierung fehlgeschlagen!', 'Die Email hat kein gültiges Format.');
            }
        } else {
            Alert.alert('Registrierung fehlgeschlagen!', 'Email ist leer.');
        }
    };

    /* Network Information */

    componentDidMount() {
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this._handleConnectivityChange
        );
        NetInfo.isConnected.fetch().done(
            (isConnected) => {
                this.setState({isConnected: isConnected});
            }
        );
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener(
            'connectionChange',
            this._handleConnectivityChange
        );
    }

    _handleConnectivityChange = (isConnected) => {
        this.setState({
            isConnected,
        });
    };

    /*end of Network Information*/

    renderPlatformDependentContent() {
        if (Platform.OS === 'ios') {
            return (
                this.renderContent()
            )
        } else {
            return (
                <KeyboardAvoidingView style={styles.container} behaviour={"height"} enabled={false}>
                    {this.renderImage()}
                    {this.renderContent()}
                </KeyboardAvoidingView>
            )
        }
    }

    renderiOSImage() {
        if (Platform.OS === 'ios') {
            return (this.renderImage())
        } else {
            return null;
        }
    }

    renderImage() {
        return (
            <View style={{flex: 1.5, justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                <Image
                    source={require('../../../resources/icons/Logo_01.png')}
                    style={{height: 90, width: 31, marginTop: 20}}
                />
            </View>
        )
    }

    renderContent() {
        return (
            <View style={{flex: 3, width: '90%', marginTop: 28, backgroundColor: '#fff'}}>
                <Content contentContainerStyle={{
                    backgroundColor: '#fff'
                }}>
                    <Form>
                        <Item style={{borderBottomWidth: 0}} inlineLabel>
                            <Label style={styles.labelText}>EMAIL</Label>
                            <Input
                                autoCapitalize="none"
                                placeholder="Email"
                                placeholderTextColor="#8b8b8b"
                                value={this.state.email}
                                style={{
                                    width: '100%',
                                    height: 40,
                                    marginLeft: 95,
                                    fontSize: 16,
                                    fontFamily: 'Hind-Medium'
                                }}
                                onChangeText={(email) => this.setState({email: email})}
                            />
                        </Item>
                        <Item style={{borderBottomWidth: 0}} inlineLabel>
                            <Label style={styles.labelText}>PASSWORT</Label>
                            <Input
                                autoCapitalize="none"
                                password={true}
                                secureTextEntry={true}
                                placeholder="Passwort"
                                placeholderTextColor="#8b8b8b"
                                value={this.state.password}
                                style={{
                                    width: '100%',
                                    height: 40,
                                    marginLeft: 72,
                                    fontSize: 16,
                                    fontFamily: 'Hind-Medium'
                                }}
                                onChangeText={(password) => this.setState({password: password})}
                            />
                        </Item>
                        <Item style={{borderBottomWidth: 0}} inlineLabel>
                            <Label style={styles.labelText}>PASSWORT WIEDERHOLEN</Label>
                            <Input
                                autoCapitalize="none"
                                password={true}
                                secureTextEntry={true}
                                placeholder="Passwort"
                                placeholderTextColor="#8b8b8b"
                                value={this.state.passwordRepeat}
                                style={{width: '100%', height: 40, fontSize: 16, fontFamily: 'Hind-Medium'}}
                                onChangeText={(passwordRepeat) => this.setState({passwordRepeat: passwordRepeat})}
                            />
                        </Item>
                        <Item style={{borderBottomWidth: 0}} inlineLabel>
                            <Label style={styles.labelText}>LAND</Label>
                            <Picker
                                style={{width: '100%', marginLeft: 95}}
                                supportedOrientations={['portrait', 'landscape']}
                                iosHeader="Heimatland wählen"
                                mode="dropdown"
                                selectedValue={this.state.country}
                                headerTitleStyle={{
                                    color: '#4e4e4e',
                                    fontFamily: 'Hind-Medium',
                                    fontSize: 14,
                                    width: '100%'
                                }}
                                headerBackButtonText=" "
                                itemTextStyle={{fontSize: 16, fontFamily: 'Hind-Medium', color: '#8b8b8b'}}
                                itemStyle={{fontSize: 16, fontFamily: 'Hind-Medium', color: '#8b8b8b'}}
                                textStyle={{fontSize: 16, fontFamily: 'Hind-Medium', paddingTop: 4, color: '#8b8b8b'}}
                                onValueChange={(value) => this.setState({country: value})}>
                                <Item label="Österreich" color='#8b8b8b' value="AT"/>
                                <Item label="Deutschland" color='#8b8b8b' value="DE"/>
                                <Item label="Schweiz" color='#8b8b8b' value="CH"/>
                            </Picker>
                        </Item>
                        <Item style={{borderBottomWidth: 0}} inlineLabel>
                            <Label style={styles.labelText}>HEIMATORT</Label>
                            <GooglePlacesAutocomplete
                                placeholder='Heimatort'
                                minLength={2}
                                autoFocus={false}
                                returnKeyType={'default'}
                                fetchDetails={false}
                                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                                    this.setState({city: data.description});
                                }}
                                query={{
                                    // available options: https://developers.google.com/places/web-service/autocomplete
                                    key: 'AIzaSyCEPgenTBC0L39r5nZTQgxyAF72vZocs58',
                                    language: 'de', // language of the results
                                    types: '(cities)',
                                    components: 'country:at|country:de|country:ch'
                                }}
                                styles={{
                                    textInputContainer: {
                                        backgroundColor: 'rgba(0,0,0,0)',
                                        borderTopWidth: 0,
                                        borderBottomWidth: 0,
                                        marginLeft: 63
                                    },
                                    textInput: {
                                        marginLeft: 0,
                                        marginRight: 0,
                                        height: 36,
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
                        <Item style={{borderBottomWidth: 0}} inlineLabel>
                            <Label style={styles.labelText}>GESCHLECHT</Label>
                            <Picker
                                style={{width: '100%', marginLeft: 61}}
                                itemTextStyle={{fontSize: 16, fontFamily: 'Hind-Medium', color: '#8b8b8b'}}
                                headerTitleStyle={{
                                    color: '#4e4e4e',
                                    fontFamily: 'Hind-Medium',
                                    fontSize: 14,
                                    width: '100%'
                                }}
                                headerBackButtonText=" "
                                itemStyle={{fontSize: 16, fontFamily: 'Hind-Medium', color: '#8b8b8b'}}
                                textStyle={{fontSize: 16, fontFamily: 'Hind-Medium', width: '100%', color: '#8b8b8b'}}
                                supportedOrientations={['portrait', 'landscape']}
                                iosHeader="Geschlecht wählen"
                                mode="dropdown"
                                selectedValue={this.state.gender}
                                onValueChange={(value) => this.setState({gender: value})}>
                                <Item label="Männlich" color='#8b8b8b' value="male"/>
                                <Item label="Weiblich" color='#8b8b8b' value="female"/>
                            </Picker>
                        </Item>
                        <Item style={{borderBottomWidth: 0}} inlineLabel>
                            <Label style={styles.labelText}>JAHRGANG</Label>
                            <Input
                                placeholder="Jahrgang"
                                keyboardType='numeric'
                                placeholderTextColor='#8b8b8b'
                                value={this.state.age.toString()}
                                style={{
                                    width: '100%',
                                    height: 40,
                                    marginLeft: 72.5,
                                    fontFamily: 'Hind-Medium',
                                    fontSize: 16,
                                    color: '#8b8b8b'
                                }}
                                onChangeText={(value) => this.setState({age: value})}
                            />
                        </Item>
                    </Form>
                </Content>
            </View>
        )
    }

    render() {
        return (
            <Container>
                <Content contentContainerStyle={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#fff'
                }}>
                    {this.renderiOSImage()}
                    {this.renderPlatformDependentContent()}
                    <View style={{flex: 0.7, width: '80%'}}>
                        <Button style={styles.blueButton} full rounded primary
                                onPress={this.performRegister}>
                            <Text style={styles.buttonText}>ACCOUNT ERSTELLEN</Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        )
    }
}

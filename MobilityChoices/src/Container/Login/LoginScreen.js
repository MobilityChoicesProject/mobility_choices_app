import React, {Component} from 'react';
import {Alert, Image, Text, View, KeyboardAvoidingView, Platform} from 'react-native';
import MobilityAPI from '../../Lib/MobilityAPI';
import RealmAPI from '../../Lib/RealmAPI';
import {
    Button,
    Container,
    Content,
    Form,
    Input,
    Item,
    Label
} from 'native-base';
import {NavigationActions} from 'react-navigation';
import {styles} from '../../Styles/GlobalStyles';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FCM from 'react-native-firebase';


const loginAction = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({routeName: 'Dashboard'})
    ]
});

export default class LoginScreen extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            title: 'Login',
            email: '',
            password: '',
            loading: false
        };
    }

    async componentWillMount() {
        var loggedIn = await MobilityAPI.checkLogin();

        if (loggedIn) {
            //store firebase token if token has changed
            this.storeFirebaseToken();

            // We are already logged in, go further.
            this.props.navigation.dispatch(loginAction);
        }
    }

    performLogin = async () => {
        this.setState({loading: true});
        if (this.state.email) {
            var response = await MobilityAPI.login(this.state.email.trim(), this.state.password);

            if (response.success) {
                var res = await MobilityAPI.loadProfile();

                if (res.success) {
                    var profile = res.data;

                    if (profile.AcceptPrivacyPolicy == null) {
                        profile.AcceptPrivacyPolicy = false;
                    }

                    await RealmAPI.createOrUpdateProfile(profile);
                    this.props.navigation.dispatch(loginAction);

                    //store firebase token for push notifications
                    this.storeFirebaseToken();
                }
            } else if (response.error.message === 'Network Error') {
                Alert.alert('Verbindung fehlgeschlagen', 'Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut!');
                this.setState({loading: false});
            } else {
                Alert.alert('Login fehlgeschlagen!', 'Bitte überprüfen Sie Ihre Eingaben.');
                this.setState({loading: false});
            }
        }
    }

    storeFirebaseToken() {
        FCM.messaging().getToken().then(token => {
            var res2 = MobilityAPI.saveFirebaseToken(token.toString());
            if (res2.success) {
                console.log("successfully stored firebase token");
            } else {
                console.log("could not store firebase token")
            }
        });

    }


    renderPlatformDependentContent() {
        if (Platform.OS === 'ios') {
            return (
                this.renderContent()
            )
        } else {
            return (
                <KeyboardAvoidingView style={styles.container} behaviour={"padding"} enabled={false}>
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
        const {navigate} = this.props.navigation;
        return (
            <View testID='loginView' style={{flex: 3, width: '90%', marginTop: 28}}>
                <Form>
                    <Item inlineLabel>
                        <Label style={{fontFamily: 'Hind-SemiBold', color: '#4e4e4e', fontSize: 10}}>EMAIL</Label>
                        <Input
                            testID='emailBox'
                            autoCapitalize="none"
                            keyboardType="email-address"
                            placeholder="Email"
                            placeholderTextColor="#8B8B8B"
                            value={this.state.email}
                            style={{
                                width: '100%',
                                height: 50,
                                marginLeft: '9%',
                                fontSize: 16,
                                fontFamily: 'Hind-Medium'
                            }}
                            onChangeText={(email) => this.setState({email: email})}
                        />
                    </Item>
                    <Item inlineLabel>
                        <Label style={{fontFamily: 'Hind-SemiBold', color: '#4e4e4e', fontSize: 10}}>PASSWORT</Label>
                        <Input
                            testID='passwordBox'
                            autoCapitalize="none"
                            password={true}
                            secureTextEntry={true}
                            placeholder="Passwort"
                            placeholderTextColor="#8b8b8b"
                            value={this.state.password}
                            style={{width: '100%', height: 50, fontSize: 16, fontFamily: 'Hind-Medium'}}
                            onChangeText={(password) => this.setState({password: password})}
                        />
                    </Item>
                </Form>
                <View style={{position: 'absolute', left: '4%', marginTop: '40%'}}>
                    <Button style={{position: 'absolute', left: '0%'}} full transparent
                            onPress={() => navigate({key: 'ForgotPassword', routeName: 'ForgotPassword'})}>
                        <Text style={{fontFamily: 'Hind-Medium', color: '#4e4e4e', fontSize: 14}}>Passwort
                            vergessen?</Text>
                        <MaterialIcon name="play" size={18} color="#4e4e4e"/>
                    </Button>
                    <Button style={{marginTop: '18%'}} full transparent
                            onPress={() => navigate({key: 'AcceptPrivacyPolicy', routeName: 'AcceptPrivacyPolicy'})}>
                        <Text style={{fontFamily: 'Hind-Medium', color: '#4e4e4e', fontSize: 14}}>Kein Account?
                            <Text style={{fontFamily: 'Hind-Bold', color: '#4e4e4e', fontSize: 14}}> Erstelle
                                einen.</Text>
                        </Text>
                        <MaterialIcon name="play" size={18} color="#4e4e4e"/>
                    </Button>
                </View>
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
                        <Button testID='loginButton' style={styles.blueButton} full rounded primary
                                onPress={this.performLogin}>
                            <Text style={styles.buttonText}>LOG IN</Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        )
    }
}

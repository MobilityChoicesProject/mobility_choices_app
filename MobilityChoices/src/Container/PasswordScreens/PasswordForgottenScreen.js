import React, {Component} from 'react';
import {Text, Image, View, Alert, Platform, KeyboardAvoidingView} from 'react-native';
import {Button, Form, Input, Item, Label, Content, Container} from 'native-base';
import MobilityAPI from '../../Lib/MobilityAPI';
import {styles} from '../../Styles/GlobalStyles';
import {getHeaderStyle} from "../../Helper/IphoneXHelper";

export default class PasswordForgottenScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: ''
        };
    }

    static navigationOptions = ({navigation}) => ({
        title: 'PASSWORT VERGESSEN',
        headerTitleStyle: {
            alignSelf: (Platform.OS === 'android') ? 'flex-end' : 'center',
            fontFamily: 'Hind-Medium',
            color: '#4e4e4e'
        },
        headerBackTitle: null,
        headerBackImage: require('../../../resources/icons/icon_back.png'),
        headerStyle: getHeaderStyle()
    });

    resetPassword = async () => {
        var res = await MobilityAPI.resetPassword(this.state.email);

        if (res.success) {
            Alert.alert('Passwort zurückgesetzt', 'Bitte überprüfen Sie Ihre Emails');
        } else {
            if (res.error.message === 'Network Error') {
                Alert.alert('Verbindung fehlgeschlagen', 'Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut!');
            } else if (res.error.response.status === 401) {
                Alert.alert('Unautorisiert', 'Bitte loggen Sie sich aus und erneut ein.');
            } else {
                Alert.alert('Fehler', 'Passwort konnte nicht zurückgesetzt werden');
            }
        }
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
        return (
            <View style={{flex: 3, width: '90%', marginTop: 28}}>
                <Text style={{
                    marginTop: '20%',
                    marginBottom: 10,
                    marginLeft: '4%',
                    fontFamily: 'Hind-Medium',
                    fontSize: 14,
                    color: '#4e4e4e'
                }}>Bitte geben Sie Ihre Email-Adresse
                    ein.</Text>
                <Form>
                    <Item inlineLabel>
                        <Label style={styles.labelText}>EMAIL</Label>
                        <Input
                            autoCapitalize="none"
                            keyboardType="email-address"
                            placeholder="Email"
                            placeholderTextColor="#D3D3D3"
                            value={this.state.email}
                            style={{
                                width: '100%',
                                height: 50,
                                fontFamily: 'Hind-Medium',
                                color: '#8b8b8b',
                                fontSize: 16
                            }}
                            onChangeText={(email) => this.setState({email: email})}
                        />
                    </Item>
                </Form>
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
                                onPress={() => this.resetPassword()}>
                            <Text style={styles.buttonText}>PASSWORT ZURÜCKSETZEN</Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        )
    }
}

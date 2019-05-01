import React, {Component} from 'react';
import {Alert, Image, KeyboardAvoidingView, Platform, Text, View} from 'react-native';
import {Button, Container, Content, Form, Input, Item, Label} from 'native-base';
import MobilityAPI from '../../Lib/MobilityAPI';
import {styles} from '../../Styles/GlobalStyles';
import Menu from "../../Components/Menu/Menu";
import {getHeaderStyle} from "../../Helper/IphoneXHelper";


export default class PasswortChangeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldPassword: '',
            newPassword: '',
            newPasswordRepeat: ''
        }
    }

    static navigationOptions = ({navigation}) => ({
        title: 'PASSWORT ÄNDERN',
        headerTitleStyle: {
            alignSelf: (Platform.OS === 'android') ? 'flex-end' : 'center',
            fontFamily: 'Hind-Medium',
            color: '#4e4e4e'
        },
        headerBackTitle: null,
        headerBackImage: require('../../../resources/icons/icon_back.png'),
        headerStyle: getHeaderStyle()
    });

    changePassword = async () => {
        if (this.state.newPassword === this.state.newPasswordRepeat) {
            var res = await MobilityAPI.changePassword(this.state.oldPassword, this.state.newPassword);

            if (res.success) {
                Alert.alert('Passwort geändert', 'Ihr Passwort wurde erfolgreich geändert.',
                    [
                        {
                            text: 'OK', onPress: () => this.props.navigation.navigate({
                                key: 'Profile',
                                routeName: 'Profile'
                            })
                        }
                    ],
                    {cancelable: false}
                );
            } else {
                if (res.error.message === 'Network Error') {
                    Alert.alert('Verbindung fehlgeschlagen', 'Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut!');
                } else if (res.error.response.status === 401) {
                    Alert.alert('Unautorisiert', 'Bitte loggen Sie sich aus und erneut ein.');
                } else {
                    Alert.alert('Fehler', 'Passwort konnte nicht geändert werden.')
                }
            }
        } else {
            Alert.alert('Fehler', 'Passwörter stimmen nicht überein.')
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
                <Form>
                    <Item>
                        <Label style={styles.labelText}>ALTES PASSWORT</Label>
                        <Input
                            autoCapitalize="none"
                            placeholder="Altes Passwort"
                            placeholderTextColor="#D3D3D3"
                            password={true}
                            secureTextEntry={true}
                            value={this.state.oldPassword}
                            style={{
                                width: '100%',
                                height: 50,
                                fontFamily: 'Hind-Medium',
                                fontSize: 16,
                                color: '#8b8b8b'
                            }}
                            onChangeText={(old) => this.setState({oldPassword: old})}
                        />
                    </Item>
                    <Item>
                        <Label style={styles.labelText}>NEUES PASSWORT</Label>
                        <Input
                            autoCapitalize="none"
                            placeholder="Neues Passwort"
                            placeholderTextColor="#D3D3D3"
                            password={true}
                            secureTextEntry={true}
                            value={this.state.newPassword}
                            style={{
                                width: '100%',
                                height: 50,
                                fontFamily: 'Hind-Medium',
                                fontSize: 16,
                                color: '#8b8b8b'
                            }}
                            onChangeText={(newPwd) => this.setState({newPassword: newPwd})}
                        />
                    </Item>
                    <Item>
                        <Label style={styles.labelText}>PASSWORT WIEDERHOLEN</Label>
                        <Input
                            autoCapitalize="none"
                            placeholder="Neues Passwort wiederholen"
                            placeholderTextColor="#D3D3D3"
                            password={true}
                            secureTextEntry={true}
                            value={this.state.newPasswordRepeat}
                            style={{
                                width: '100%',
                                height: 50,
                                fontFamily: 'Hind-Medium',
                                fontSize: 16,
                                color: '#8b8b8b'
                            }}
                            onChangeText={(newPwdRepeat) => this.setState({newPasswordRepeat: newPwdRepeat})}
                        />
                    </Item>
                </Form>
                <Button style={{marginBottom: 10, backgroundColor: '#78D1C0', height: 35, marginTop: 70}} full rounded
                        primary
                        onPress={() => this.changePassword()}>
                    <Text style={styles.buttonText}>PASSWORT ÄNDERN</Text>
                </Button>
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
                </Content>
                <Menu navigation={this.props.navigation}/>
            </Container>
        )
    }
}

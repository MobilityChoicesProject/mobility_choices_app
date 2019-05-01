import React, {Component} from 'react';
import {Alert, Animated, ScrollView, Text, View, Platform} from 'react-native';
import CheckBox from 'react-native-checkbox';
import {getHeaderStyle} from "../../Helper/IphoneXHelper";
import {
    Button,
    Container,
    Content,
} from 'native-base';
import {styles} from '../../Styles/GlobalStyles';
import PrivacyPolicyComponent from '../../Components/PrivacyPolicy/PrivacyPolicyComponent';

export default class AcceptPrivacyPolicy extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isChecked: false,
            scrollY: new Animated.Value(0)
        };
    }

    static navigationOptions = ({navigation}) => ({
        title: ' ',
        headerTitleStyle: {
            alignSelf: (Platform.OS === 'android') ? 'flex-end' : 'center',
            fontFamily: 'Hind-Medium',
            color: '#4e4e4e'
        },
        headerBackTitle: null,
        headerBackImage: require('../../../resources/icons/icon_back.png'),
        headerStyle: getHeaderStyle()
    });

    componentDidMount() {
        Alert.alert('Hinweis', 'Bevor Sie sich registrieren, sollten Sie unsere Datenschutzerklärung akzeptieren. ' +
            'Falls Sie diese nicht akzeptieren möchten, kann die Registrierung leider nicht fortgeführt werden.')
    }

    updateAccepted = (checked) => {
        this.setState({isChecked: checked});
    };

    accept() {
        if (this.state.isChecked) {
            this.props.navigation.navigate({key: 'Register', routeName: 'Register'});
        } else {
            Alert.alert('Hinweis', 'Sie müssen zuerst die Datenschutzerklärung akzeptieren.')
        }
    }

    render() {
        return (
            <Container style={{backgroundColor: '#fff'}}>
                <Content contentContainerStyle={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    margin: 10,
                    backgroundColor: '#fff'
                }}>
                    <Text style={{
                        fontSize: 16,
                        fontFamily: 'Hind-Bold',
                        color: '#4e4e4e'
                    }}>{'NUTZUNGSBEDINGUNGEN UND DATENSCHUTZERKLÄRUNG'}{"\n"}</Text>
                    <View style={{borderTopColor: '#b3bbbb', borderTopWidth: 1, width: '100%', marginTop: 3}}/>
                    <ScrollView>
                        <PrivacyPolicyComponent/>
                    </ScrollView>
                    <View style={{borderTopColor: '#b3bbbb', borderTopWidth: 1, width: '100%', marginBottom: 20}}/>
                    <View style={{width: '100%'}}>
                        <CheckBox label='Ich akzeptiere die Datenschutzerklärung'
                                  onChange={this.updateAccepted}/>
                        <View style={{marginTop: 20}}>
                            <Button style={styles.blueButton} full rounded primary
                                    onPress={() => this.accept()}>
                                <Text style={styles.buttonText}>WEITER</Text>
                            </Button>
                        </View>
                    </View>

                </Content>
            </Container>
        );
    }
}

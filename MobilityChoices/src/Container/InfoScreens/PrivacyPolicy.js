import React, {Component} from 'react';
import {ScrollView, Text, View, Platform} from 'react-native';
import {getHeaderStyle} from "../../Helper/IphoneXHelper";
import {
    Container,
    Content
} from 'native-base';
import PrivycyPolicyComponent from '../../Components/PrivacyPolicy/PrivacyPolicyComponent';

export default class PrivacyPolicy extends Component {

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

    render() {
        return (
            <Container style={{backgroundColor: '#fff'}}>
                <Content contentContainerStyle={{
                    flex: 1,
                    margin: 10,
                    backgroundColor: '#fff'
                }}>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: 'bold'
                    }}>{'NUTZUNGSBEDINGUNGEN UND DATENSCHUTZERKLÄRUNG'}{"\n"}</Text>
                    <View style={{borderTopColor: '#4c4e4f', borderTopWidth: 1, width: '100%', marginTop: 10}}/>
                    <ScrollView>
                        <PrivycyPolicyComponent/>
                    </ScrollView>
                </Content>
            </Container>
        );
    }
}

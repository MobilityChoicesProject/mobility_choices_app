import React, {Component} from 'react';
import {Text, View, Platform} from 'react-native';
import RealmAPI from '../../../Lib/RealmAPI';
import {getHeaderStyle} from "../../../Helper/IphoneXHelper";
import {
    Button,
    Container,
    Content
} from 'native-base';
import {styles} from '../../../Styles/GlobalStyles';

export default class Start extends Component {
    static navigationOptions = ({navigation}) => ({
        title: 'PROFIL ERSTELLEN',
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
            title: 'Profil erstellen',
            myProfile: this.props.navigation.state.params.profile
        };
    }

    goToNext = async () => {
        await RealmAPI.createOrUpdateProfile(this.state.myProfile);
        this.props.navigation.navigate({key: 'Time', routeName: 'Time', params: {profile: this.state.myProfile}});
    };

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
                    <View style={{flex: 2}}>
                        <Text style={{
                            textAlign: 'left',
                            fontSize: 16,
                            color: '#4e4e4e',
                            marginLeft: 60,
                            marginRight: 60,
                            marginTop: 180,
                            fontFamily: 'Hind-Medium'
                        }}>
                            Um die Anwendung, speziell die Routenplanung, an ihre persönlichen Bedürfnisse anpassen zu
                            können, bitten wir Sie ein paar kurze Fragen zu beantworten. </Text>
                    </View>
                    <View style={{flex: 0.4, width: '80%'}}>
                        <Button style={styles.blueButton} full rounded primary onPress={this.goToNext}>
                            <Text style={styles.buttonText}>PROFIL ERSTELLEN</Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        )
    }
}

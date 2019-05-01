import React, {Component} from 'react';
import {Text, View, Platform} from 'react-native';
import MobilityAPI from '../../../Lib/MobilityAPI';
import {getHeaderStyle} from "../../../Helper/IphoneXHelper";
import {
    Button,
    Container,
    Content
} from 'native-base';
import {NavigationActions} from 'react-navigation';
import {styles} from '../../../Styles/GlobalStyles';

const resetAction = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({
            key: 'Dashboard',
            routeName: 'Dashboard'
        })
    ]
});

export default class Finish extends Component {
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
            myProfile: this.props.navigation.state.params.profile,
            profileUpdate: null
        };
    }

    async componentWillMount() {
        this.updateProfile();
    }

    goToNext() {
        this.props.navigation.dispatch(resetAction);
    }

    async updateProfile() {
        var result = await MobilityAPI.updateProfile(this.state.myProfile);
        this.setState({profileUpdate: result});
    }

    render() {
        var message;
        var buttonText;
        var action;

        if (this.state.profileUpdate) {
            if (this.state.profileUpdate.success) {
                message = 'Ihr Profil wurde erfolgreich angelegt, und kann jederzeit unter dem Abschnitt "Mein Profil" von Ihnen angepasst werden.\n\nViel Spaß! ';
                buttonText = "LOS GEHT'S";
                action = () => {
                    var self = this;
                    self.goToNext();
                };
            } else {
                message = 'Ihr Profil konnte nicht vollständig angelegt werden.\nBitte versuchen Sie es erneut!';
                buttonText = 'NOCHMALS PROBIEREN';
                action = () => {
                    var self = this;
                    self.updateProfile();

                    if (this.state.profileUpdate.success) {
                        self.goToNext();
                    }
                };
            }
        }

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
                        }}>{message}</Text>
                    </View>
                    <View style={{flex: 0.4, width: '80%'}}>
                        <Button style={styles.blueButton} full rounded primary onPress={() => {
                            action()
                        }}>
                            <Text style={styles.buttonText}>{buttonText}</Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        )
    }
}

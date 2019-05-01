import React, {Component} from 'react';
import {Slider, Text, View, Image, Platform} from 'react-native';
import RealmAPI from '../../../Lib/RealmAPI';
import {getHeaderStyle} from "../../../Helper/IphoneXHelper";
import {
    Button,
    Container,
    Content,
    Label
} from 'native-base';
import update from 'immutability-helper';

import {styles} from '../../../Styles/GlobalStyles';

export default class Environment extends Component {
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
        this.props.navigation.navigate({key: 'Health', routeName: 'Health', params: {profile: this.state.myProfile}});
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
                    <View style={{flex: 3}}>
                        <Image source={require('../../../../resources/icons/icon_Umwelt.png')}
                               style={{height: 70, width: 50, marginTop: 80}}/>
                    </View>
                    <View style={{flex: 2}}>
                        <Text style={styles.questionText}>Wie wichtig ist Ihnen die Umwelt bei der Wahl der
                            Verkehrsmittel?</Text>
                    </View>
                    <View style={{flex: 2}}>
                        <Label style={styles.sliderLabel}>UMWELT</Label>
                        <View style={{padding: 3}}>
                            <View style={styles.preferences}>
                                <Slider minimumTrackTintColor={'#B0CE00'}
                                        thumbTintColor={'#B0CE00'}
                                        step={1} value={this.state.myProfile.envValue} minimumValue={0}
                                        maximumValue={10}
                                        style={styles.slider}
                                        onSlidingComplete={(value) => this.setState({
                                            myProfile: update(this.state.myProfile, {
                                                envValue: {$set: value}
                                            })
                                        })}/>
                            </View>
                            <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                                <Text style={styles.questionSliderLabel}>NICHT WICHTIG</Text>
                                <Text style={styles.questionSliderLabel}>SEHR WICHTIG</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{width: '80%', flex: 1.4}}>
                        <Button style={styles.greenButton} full rounded primary onPress={this.goToNext}>
                            <Text style={styles.buttonText}>WEITER</Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        )
    }
}

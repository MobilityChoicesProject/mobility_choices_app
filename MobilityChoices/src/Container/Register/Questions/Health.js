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

export default class Health extends Component {
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
        this.props.navigation.navigate({key: 'Finish', routeName: 'Finish', params: {profile: this.state.myProfile}});
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
                    <View style={{flex: 3}}>
                        <Image source={require('../../../../resources/icons/icon_Gesundheit.png')}
                               style={{height: 60, width: 65, marginTop: 80}}/>
                    </View>
                    <View style={{flex: 2}}>
                        <Text style={styles.questionText}>Wie wichtig ist Ihnen Ihre Gesundheit bei der Wahl der
                            Verkehrsmittel?</Text>
                    </View>
                    <View style={{flex: 2}}>
                        <Label style={styles.sliderLabel}>GESUNDHEIT</Label>
                        <View style={{padding: 3}}>
                            <View style={styles.preferences}>
                                <Slider minimumTrackTintColor={'#FF5F7C'}
                                        thumbTintColor={'#FF5F7C'}
                                        step={1} value={this.state.myProfile.healthValue} minimumValue={0}
                                        maximumValue={10}
                                        style={styles.slider}
                                        onSlidingComplete={(value) => this.setState({
                                            myProfile: update(this.state.myProfile, {
                                                healthValue: {$set: value}
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
                        <Button style={styles.pinkButton} full rounded primary onPress={this.goToNext}>
                            <Text style={styles.buttonText}>WEITER</Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        )
    }
}

import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {
    Button,
    Input,
    Item,
    Label,
    ListItem,
    Picker,
} from 'native-base';
import ComponentHelper from '../../Helper/ComponentHelper';
import ObjectHelper from '../../Helper/ObjectHelper';
import {styles} from '../../Styles/GlobalStyles';

var {GooglePlacesAutocomplete} = require('react-native-google-places-autocomplete');


export default class UserDataComponent extends Component {
    propertiesHaveChanged = true;

    constructor(props) {
        super(props);
    }


    async handleValue(value, valueName) {
        this.propertiesHaveChanged = true;
        await ComponentHelper.updateObjectStateValue(this.props.self, value, 'myProfile', valueName, 'changedProfile');
    }

    updateCountryValue = (value) => {
        this.handleValue(value, 'country');
    };

    updateGenderValue = (value) => {
        this.handleValue(value, 'gender');
    };

    updateAgeValue = (value) => {
        this.handleValue(value, 'age');
    };

    updateCityValue = (value) => {
        this.handleValue(value, 'city');
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.self.initialized) {
            var currentValue = this.propertiesHaveChanged;
            return currentValue;
        }

        return false;
    }

    componentDidUpdate(prevProps, prevState) {
        ComponentHelper.propertiesHaveChangedTimeout(() => {
            this.propertiesHaveChanged = false;
        });
    }

    showPwdChangeScreen() {
        this.props.navigation.navigate({key: 'PasswordChange', routeName: 'PasswordChange'});
    }

    render() {
        return (
            <View>
                <ListItem style={{flex: 1, flexDirection: 'row', borderBottomWidth: 0}}>
                    <Label numberOfLines={1} style={styles.labelTextUserProfile}>EMAIL</Label>
                    <Text style={{
                        fontSize: 16,
                        color: "#8b8b8b",
                        fontFamily: 'Hind-Medium',
                        marginLeft: 5
                    }}>{this.props.state.email}</Text>
                </ListItem>
                <ListItem inlineLabel style={{flex: 1, flexDirection: 'row', borderBottomWidth: 0}}>
                    <Label numberOfLines={1} style={styles.labelTextUserProfile}>LAND</Label>
                    <Picker
                        style={{flex: 1, marginLeft: -11}}
                        supportedOrientations={['portrait', 'landscape']}
                        iosHeader="Heimatland wählen"
                        headerTitleStyle={{color: '#4e4e4e', fontFamily: 'Hind-Medium', fontSize: 14, width: '100%'}}
                        headerBackButtonText=" "
                        mode="dropdown"
                        itemTextStyle={{fontSize: 16, fontFamily: 'Hind-Medium', color: '#8b8b8b'}}
                        itemStyle={{fontSize: 16, fontFamily: 'Hind-Medium', color: '#8b8b8b'}}
                        textStyle={{fontSize: 16, fontFamily: 'Hind-Medium', paddingTop: 4, color: '#8b8b8b'}}
                        selectedValue={this.props.state.myProfile.country}
                        onValueChange={this.updateCountryValue}>
                        <Item label="Österreich" color="#8b8b8b" value="AT"/>
                        <Item label="Deutschland" color="#8b8b8b" value="DE"/>
                        <Item label="Schweiz" color="#8b8b8b" value="CH"/>
                    </Picker>
                </ListItem>
                <ListItem inlineLabel style={{flex: 1, flexDirection: 'row', borderBottomWidth: 0}}>
                    <Label numberOfLines={1} style={styles.labelTextUserProfile}>ORT</Label>
                    <GooglePlacesAutocomplete
                        placeholder={this.props.state.myProfile.city}
                        minLength={2}
                        autoFocus={false}
                        returnKeyType={'default'}
                        fetchDetails={false}
                        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                            this.updateCityValue(data.description);
                        }}
                        query={{
                            // available options: https://developers.google.com/places/web-service/autocomplete
                            key: 'AIzaSyCEPgenTBC0L39r5nZTQgxyAF72vZocs58',
                            language: 'de', // language of the results
                            types: '(cities)', //limit to cities
                            components: 'country:at|country:de|country:ch'
                        }}
                        placeholderTextColor='#8b8b8b'
                        styles={{
                            textInputContainer: {
                                backgroundColor: 'rgba(0,0,0,0)',
                                borderTopWidth: 0,
                                borderBottomWidth: 0
                            },
                            textInput: {
                                marginLeft: -4,
                                marginRight: 0,
                                height: 38,
                                color: '#8b8b8b',
                                fontSize: 16,
                                fontFamily: 'Hind-Medium'
                            },
                            predefinedPlacesDescription: {
                                color: '#000'
                            },
                            flex: 1,
                        }}
                        currentLocation={false}
                    />
                </ListItem>
                <ListItem inlineLabel style={{flex: 1, flexDirection: 'row', borderBottomWidth: 0}}>
                    <Label numberOfLines={1} style={styles.labelTextUserProfile}>GESCHLECHT</Label>
                    <Picker
                        style={{flex: 1, marginLeft: -11}}
                        supportedOrientations={['portrait', 'landscape']}
                        iosHeader="Geschlecht wählen"
                        headerTitleStyle={{color: '#4e4e4e', fontFamily: 'Hind-Medium', fontSize: 14, width: '100%'}}
                        headerBackButtonText=" "
                        itemTextStyle={{fontSize: 16, fontFamily: 'Hind-Medium', color: '#8b8b8b'}}
                        itemStyle={{fontSize: 16, fontFamily: 'Hind-Medium', color: '#8b8b8b'}}
                        textStyle={{fontSize: 16, fontFamily: 'Hind-Medium', paddingTop: 4, color: '#8b8b8b'}}
                        mode="dropdown"
                        selectedValue={this.props.state.myProfile.gender}
                        onValueChange={this.updateGenderValue}>
                        <Item label="Männlich" color="#8b8b8b" value="male"/>
                        <Item label="Weiblich" color="#8b8b8b" value="female"/>
                    </Picker>
                </ListItem>
                <ListItem inlineLabel style={{flex: 1, flexDirection: 'row', borderBottomWidth: 0}}>
                    <Label numberOfLines={1} style={styles.labelTextUserProfile}>JAHRGANG</Label>
                    <Input
                        placeholder="Jahrgang"
                        placeholderTextColor="#8b8b8b"
                        keyboardType="numeric"
                        returnKeyType="done"
                        value={ObjectHelper.getValueOrDefaultString(this.props.state.myProfile.age)}
                        style={{
                            flex: 1,
                            marginTop: '1%',
                            width: '100%',
                            fontSize: 16,
                            color: "#8b8b8b",
                            fontFamily: 'Hind-Medium',
                            marginLeft: 5
                        }}
                        onChangeText={this.updateAgeValue}
                    />

                </ListItem>
                <ListItem inlineLabel style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                    <View style={{width: '80%'}}>
                        <Button style={styles.blueButton} full rounded primary
                                onPress={() => this.showPwdChangeScreen()}><Text style={styles.buttonText}>PASSWORT
                            ÄNDERN</Text>
                        </Button>
                    </View>
                </ListItem>
            </View>
        );
    }
}

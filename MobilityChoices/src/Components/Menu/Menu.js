import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper'
import {styles} from "../../Styles/GlobalStyles";
import {createIconSetFromFontello} from "react-native-vector-icons";
import fontelloConfig from '../../IconConfig/config.json';

const Icon = createIconSetFromFontello(fontelloConfig);

export default class Menu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            navigation: this.props.navigation
        };
    }

    renderContent() {

    }

    barStyle() {
        if (isIphoneX()) {
            return {
                backgroundColor: '#eeeeee',
                justifyContent: 'center',
                flexDirection: 'row',
                height: 70
            }
        } else {
            return {
                backgroundColor: '#eeeeee',
                justifyContent: 'center',
                flexDirection: 'row',
                height: 50
            }
        }

    }

    render() {
        const {navigate} = this.props.navigation;
        return (
            <View style={this.barStyle()}>
                <TouchableOpacity style={{justifyContent: 'center', flex: 1}} underlayColor={'#A4D1F0'}
                                  onPress={() => navigate({key: 'Dashboard', routeName: 'Dashboard'})}>
                    <View style={styles.navigationBar}>
                        <Icon style={{marginTop: 0}} size={20} color="#4e4e4e" name="icon_dashboard"/>
                        <Text style={{
                            fontSize: 10,
                            textAlign: 'center',
                            fontFamily: 'Hind-Medium',
                            color: '#4e4e4e'
                        }}>Dashboard</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{justifyContent: 'center', flex: 1}} underlayColor={'#A4D1F0'}
                                  onPress={() => navigate({
                                      key: 'Profile',
                                      routeName: 'Profile',
                                      params: {onClose: this.props.navigation.state.params.onClose}
                                  })}>
                    <View style={styles.navigationBar}>
                        <Icon style={{marginTop: 0}} size={20} color="#4e4e4e" name="icon_meinprofil"/>
                        <Text style={{
                            fontSize: 10,
                            textAlign: 'center',
                            fontFamily: 'Hind-Medium',
                            color: '#4e4e4e'
                        }}>Profil</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{justifyContent: 'center', flex: 1}} underlayColor={'#A4D1F0'}
                                  onPress={() => navigate({
                                      key: 'AllTracks',
                                      routeName: 'AllTracks',
                                      params: {onClose: this.props.navigation.state.params.onClose}
                                  })}>
                    <View style={styles.navigationBar}>
                        <Icon style={{marginTop: 0}} size={20} color="#4e4e4e" name="icon_allewege"/>
                        <Text style={{fontSize: 10, textAlign: 'center', fontFamily: 'Hind-Medium', color: '#4e4e4e'}}>Alle
                            Wege</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{justifyContent: 'center', flex: 1}} underlayColor={'#A4D1F0'}
                                  onPress={() => navigate({
                                      key: 'PlanRoute',
                                      routeName: 'PlanRoute',
                                      params: {
                                          start: '',
                                          end: '',
                                          via: '',
                                          onClose: this.props.navigation.state.params.onClose
                                      }
                                  })}>
                    <View style={styles.navigationBar}>
                        <Icon style={{marginTop: 0}} size={20} color="#4e4e4e" name="icon_routeplanen"/>
                        <Text style={{
                            fontSize: 10,
                            textAlign: 'center',
                            fontFamily: 'Hind-Medium',
                            color: '#4e4e4e'
                        }}>Planen</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

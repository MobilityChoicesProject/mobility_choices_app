import React, {Component} from 'react';
import {Platform, Text, View} from 'react-native';
import {getHeaderStyle} from "../../../Helper/IphoneXHelper";
import {
    Container,
    Content
} from 'native-base';
import MapComponent from '../../../Components/Map/Small/MapComponent';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import fontelloConfig from '../../../IconConfig/config.json';
import Menu from "../../../Components/Menu/Menu";
import Helper from '../../../Lib/HelperAPI';


const Icon = createIconSetFromFontello(fontelloConfig);

export default class TrackDetail extends Component {

    static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state;

        return {
            title: 'DEINE AUFZEICHNUNG',
            headerTitleStyle: {
                alignSelf: (Platform.OS === 'android') ? 'flex-end' : 'center',
                fontFamily: 'Hind-Medium',
                color: '#4e4e4e'
            },
            headerBackTitle: null,
            headerBackImage: require('../../../../resources/icons/icon_back.png'),
            headerStyle: getHeaderStyle()
        }

    };

    constructor(props) {
        super(props);
        this.state = {
            name: this.props.navigation.state.params.track.name,
            track: this.props.navigation.state.params.track,
            routeCoordinates: this.props.navigation.state.params.coordinates,
        };
    }


    render() {
        return (
            <Container>
                <Content contentContainerStyle={{
                    backgroundColor: '#fff'
                }}>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{
                            color: '#4e4e4e',
                            fontSize: 23,
                            marginTop: 16,
                            marginBottom: 2,
                            marginLeft: 20,
                            fontFamily: 'Hind-SemiBold'
                        }}>{this.state.name}</Text>
                        <View style={{marginLeft: 22, marginBottom: 16}}>
                            {Helper.renderFormattedDate(this.state.track.date, "DD.MM.YYYY")}
                        </View>

                        <MapComponent track={this.state.routeCoordinates}/>
                    </View>
                </Content>
                <Menu navigation={this.props.navigation}/>
            </Container>
        )
    }
}

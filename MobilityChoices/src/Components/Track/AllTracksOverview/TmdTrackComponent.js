import React, {Component} from 'react';
import {Alert, TouchableOpacity, View} from 'react-native';
import {Left, Right, Spinner, Text} from 'native-base';
import Helper from '../../../Lib/HelperAPI';
import MobilityAPI from '../../../Lib/MobilityAPI';
import RealmAPI from '../../../Lib/RealmAPI';
import {styles} from '../../../Styles/GlobalStyles';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import fontelloConfig from '../../../IconConfig/config.json';

const Icon = createIconSetFromFontello(fontelloConfig);

export default class TmdTrackComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            track: this.props.track,
            isDeleting: false
        };
    }


    deleteTrack = () => {
        Alert.alert(
            'Track löschen',
            'Sind Sie sicher, dass Sie den Track löschen wollen?',
            [
                {text: 'Ja', onPress: () => this.finalDelete()},
                {text: 'Nein', style: 'cancel'}
            ],
            {cancelable: false}
        )
    };


    async finalDelete() {
        this.setState({isDeleting: true});
        var res = await MobilityAPI.updateFinalTMDTrack(this.state.track, true, true);

        if (res.success) {
            //Track lokal löschen
            await this.props.remove(this.state.track);
            RealmAPI.deleteTmdTrack(this.state.track);
        } else {
            this.setState({isDeleting: false});

            Alert.alert(
                'Löschen fehlgeschlagen',
                'Leider konnte keine Verbndung zum Server hergestellt werden.'
            )
        }
    }

    render() {
        var sections1 = this.state.track.sections;
        var sections2 = [];
        if (sections1.length >= 4) {
            var fillin = {type: "fillin", duration: "...", transportMode: "fillin"}
            sections2[0] = sections1[0];
            sections2[1] = sections1[1];
            sections2[2] = fillin;
            sections2[3] = sections1[sections1.length - 1];
        }
        var finalSections;
        if (sections2.length > 0) {
            finalSections = sections2;
        } else {
            finalSections = sections1;
        }

        var index;
        for (index = 0; index < finalSections.length; ++index) {
            finalSections[index].key = index;
        }

        const sections = finalSections.map((item, index) => {
            return (
                <View style={styles.route} key={index}>
                    <View style={{backgroundColor: '#4e4e4e', height: 2, position: 'absolute', left: 0, right: 0}}/>
                    <View style={styles.circle}/>
                    {finalSections.length - 1 === index ?
                        <View style={styles.circleEnd}><View style={styles.blackInnerCircle}/></View> : null}
                </View>
            )
        });

        const transportModes = finalSections.map((item, index) => {
            return (
                <View style={styles.transportModes} key={index}>
                    {Helper.renderIconForType(item.transportMode)}
                </View>
            )
        });

        const time = finalSections.map((item, index) => {
            if (item.duration === "...") {
                return (
                    <View style={styles.time} key={item.key}>
                        <Text style={{fontFamily: 'Hind-Medium', color: '#4e4e4e'}}>...</Text>
                    </View>
                )
            }
            return (
                <View style={styles.time} key={index}>
                    {Helper.renderRoundedTime(item.duration)}
                </View>
            )
        });

        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate({
                key: 'TmdTrackDetails',
                routeName: 'TmdTrackDetails',
                params: {
                    item: this.state.track,
                    track: sections1,
                    refresh: this.props.refresh,
                    remove: this.props.remove,
                    upgrade: this.props.upgrade
                }
            })} style={{margin: 20}}>
                <View style={styles.track}>
                    <View style={styles.trackData}>
                        <Left>
                            <View style={{flexDirection: 'column'}}>
                                <Text
                                    style={{
                                        fontSize: 20,
                                        fontFamily: 'Hind-SemiBold',
                                        color: '#4e4e4e'
                                    }}> {this.state.track.name} </Text>
                                <View style={{marginLeft: 6}}>
                                    {Helper.renderFormattedDate(this.state.track.date, "DD.MM.YYYY")}
                                </View>
                            </View>
                        </Left>
                        <Right>
                            <View style={{flexDirection: 'row'}}>
                                <Icon name="icon_aendern" size={27} style={{marginRight: 30, color: '#78D1C0'}}/>
                                {this.state.isDeleting ?
                                    <Spinner color={'#78D1C0'}/>
                                    :
                                    <Icon onPress={this.deleteTrack} name="icon_papierkorb" size={27} color='#4e4e4e'/>
                                }
                            </View>
                        </Right>
                    </View>
                    <View style={styles.sections}>
                        {transportModes}
                    </View>
                    <View style={styles.sections}>
                        {sections}
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        {time}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

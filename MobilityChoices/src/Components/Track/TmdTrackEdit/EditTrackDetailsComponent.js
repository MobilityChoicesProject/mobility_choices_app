import React, {Component} from 'react';
import {View} from 'react-native';
import {Picker, Form, Left, Text, Right} from 'native-base';
import RealmAPI from '../../../Lib/RealmAPI';
import Helper from '../../../Lib/HelperAPI';
import {styles} from '../../../Styles/GlobalStyles';

export default class EditTrackDetailsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            section: this.props.section,
            track: this.props.track,
            sections: this.props.sections,
            tm: this.props.section.transportMode,
            waypoint: this.props.section.waypoint,
            lastItem: this.props.lastItem
        };
    }

    onPressTransportMode = async (value) => {
        var result = await RealmAPI.setTMDTransportMode(this.state.track, this.state.sections, this.state.section, value);

        if (result.success) {
            this.setState({track: result.data});
        }
    };

    onValueChange(value) {
        this.setState({
            tm: value
        });
        this.onPressTransportMode(value);
    }

    render() {
        return (
            <View style={styles.trackDetails}>
                <View style={styles.sectionsDetails}>
                    <View style={styles.timeDetails}>
                        <Text
                            style={{marginRight: 8}}> {Helper.renderFormattedDate(this.state.section.start.timestamp, "HH:mm")} </Text>
                        {this.state.lastItem ?
                            <Text
                                style={{marginRight: 8}}> {Helper.renderFormattedDate(this.state.section.end.timestamp, "HH:mm")} </Text> : null
                        }
                    </View>
                </View>
                <View style={styles.sectionsDetails}>
                    <View style={styles.routeDetails}>
                        <View style={styles.line}/>
                        {this.state.waypoint ?
                            <View style={styles.circleDetails}>
                                <View style={styles.blueInnerCircle}/>
                            </View> : <View style={styles.circleDetails}/>
                        }
                        {this.state.lastItem ?
                            <View style={styles.circleEndDetails}>
                                <View style={styles.blackInnerCircle}/>
                            </View> : null
                        }
                    </View>
                </View>
                <View style={styles.sectionsDetails}>
                    <View style={styles.transportModesDetails}>
                        <View style={{alignItems: 'flex-start', justifyContent: 'flex-start', marginLeft: 2}}>
                            <Text style={{
                                color: '#4e4e4e',
                                fontSize: 10,
                                fontFamily: 'Hind-SemiBold'
                            }}>{this.state.section.start.name}</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '64%'
                        }}>
                            <Left>
                                <View style={styles.edittransports}>
                                    <View style={{width: 40, marginLeft: 5}}>
                                        {Helper.renderIconForType(this.state.section.transportMode)}
                                    </View>
                                    <Form>
                                        <Picker
                                            style={{width: 130}}
                                            supportedOrientations={['portrait', 'landscape']}
                                            iosHeader="Wähle..."
                                            mode="dropdown"
                                            selectedValue={this.state.tm}
                                            onValueChange={this.onValueChange.bind(this)}>
                                            <Picker.Item label="Bus" value="BUS"/>
                                            <Picker.Item label="Bahn" value="TRAIN"/>
                                            <Picker.Item label="Auto" value="CAR"/>
                                            <Picker.Item label="Fahrrad" value="BIKE"/>
                                            <Picker.Item label="Zu Fuß" value="NON_VEHICLE"/>
                                            <Picker.Item label="Stationär" value="STATIONARY"/>
                                        </Picker>
                                    </Form>
                                </View>
                            </Left>
                            <Right>
                                <Text
                                    style={{fontWeight: 'bold'}}>{Helper.renderRoundedTime(this.state.section.duration)}</Text>
                                {this.state.section.transportMode !== 'STATIONARY' ? <Text
                                    style={{fontWeight: 'bold'}}>{Helper.renderRoundedDistance(this.state.section.distance)}</Text> : null}
                            </Right>
                        </View>
                        {this.state.lastItem ? <Text style={{
                                color: '#4e4e4e',
                                fontSize: 10,
                                fontFamily: 'Hind-SemiBold',
                                marginLeft: 2
                            }}>{this.state.section.end.name}</Text> :
                            <View style={{alignItems: 'flex-start', justifyContent: 'flex-start', marginLeft: 2}}/>}
                    </View>
                </View>
            </View>
        )
    }
}
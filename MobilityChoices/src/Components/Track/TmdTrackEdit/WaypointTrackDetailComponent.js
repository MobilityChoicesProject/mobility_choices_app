import React, {Component} from 'react';
import {View} from 'react-native';
import {Form, Left, Picker, Right, Text} from 'native-base';
import RealmAPI from '../../../Lib/RealmAPI';
import Helper from '../../../Lib/HelperAPI';
import {styles} from '../../../Styles/GlobalStyles';

export default class WaypointTrackDetailComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            section: this.props.section,
            track: this.props.track,
            sections: this.props.sections,
            waypoint: this.props.section.waypoint,
            lastItem: this.props.lastItem,
            waypointmode: ""
        };
    }

    componentDidMount() {
        if (this.state.waypoint == false) {
            this.setState({waypointmode: "noZW"});
        } else if (this.state.waypoint == true) {
            this.setState({waypointmode: "ZW"});
        }
    }

    setWaypointforSection = async () => {
        var result = await RealmAPI.setWaypoint(this.state.track, this.state.sections, this.state.section, this.state.waypoint);
        if (result.success) {
            this.setState({track: result.data});
        }
    }

    onValueChange = async (value) => {
        if (value == "ZW") {
            this.setState({waypointmode: value});
            await this.setState({waypoint: true});
            this.setWaypointforSection();
        }
        if (value == "noZW") {
            this.setState({waypointmode: value});
            await this.setState({waypoint: false});
            this.setWaypointforSection();
        }
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
                            justifyContent: 'flex-start',
                            width: '64%'
                        }}>
                            <Text style={{paddingTop: 3}}>Zwischenziel setzen?</Text>
                            <Form>
                                <View style={{backgroundColor: '#e0eeee', marginLeft: 10}}>
                                    <Picker
                                        style={{width: 100, height: 30, backgroundColor: '#e0eeee'}}
                                        supportedOrientations={['portrait', 'landscape']}
                                        iosHeader="Wähle..."
                                        mode="dropdown"
                                        selectedValue={this.state.waypointmode}
                                        onValueChange={this.onValueChange.bind(this)}>
                                        <Picker.Item label="JA" value="ZW"/>
                                        <Picker.Item label="NEIN" value="noZW"/>
                                    </Picker>
                                </View>
                            </Form>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '64%'
                        }}>
                            <Left>
                                <View style={{flexDirection: 'row'}}>
                                    {Helper.renderIconForType(this.state.section.transportMode)}
                                    <Text
                                        style={{
                                            marginLeft: 10,
                                            color: '#4e4e4e',
                                            fontFamily: 'Hind-Medium',
                                            fontSize: 14
                                        }}>{Helper.getGermanTransportType(this.state.section.transportMode)}</Text>
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
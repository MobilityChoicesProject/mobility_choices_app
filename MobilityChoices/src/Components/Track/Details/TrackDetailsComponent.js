import React, {Component} from 'react';
import {View} from 'react-native';
import {Left, Right, Text} from 'native-base';
import Helper from '../../../Lib/HelperAPI';
import {styles} from '../../../Styles/GlobalStyles';

export default class TrackDetailsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            section: this.props.section,
            waypoint: this.props.section.waypoint,
            lastItem: this.props.lastItem
        };
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

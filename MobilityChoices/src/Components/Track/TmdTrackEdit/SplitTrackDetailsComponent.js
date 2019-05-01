import React, {Component} from 'react';
import {View} from 'react-native';
import {Picker, Form, Text, Right, Left} from 'native-base';
import RealmAPI from '../../../Lib/RealmAPI';
import Helper from '../../../Lib/HelperAPI';
import {styles} from '../../../Styles/GlobalStyles';

export default class SplitTrackDetailsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            section: this.props.section,
            track: this.props.track,
            sections: this.props.sections,
            sectionmode: "",
            endpoint: this.props.section.endpoint,
            waypoint: this.props.section.waypoint,
            index: this.props.index,
            lastItem: false,
        };
    }

    componentDidMount() {
        if (this.state.index < (this.state.sections.length - 1)) {
            this.setState({lastItem: false});
        } else if (this.state.index == (this.state.sections.length - 1)) {
            this.setState({endpoint: true});
            this.setEndpoint(this.state.endpoint);
            this.setState({lastItem: true});
        }

        if (this.state.endpoint == false) {
            this.setState({sectionmode: "DEFAULT"});
        } else if (this.state.endpoint == true) {
            this.setState({sectionmode: "ENDE"});
        }
    }


    setEndpoint = async (value) => {
        var result = await RealmAPI.setEndpoint(this.state.track, this.state.sections, this.state.section, value);

        if (result.success) {
            this.setState({track: result.data});
        }
    }

    onValueChange = async (value) => {
        this.setState({
            sectionmode: value
        });
        await this.setState({endpoint: !this.state.endpoint});
        this.setEndpoint(this.state.endpoint);
    }

    twigStyle = function () {
        if (this.state.endpoint == true && this.state.lastItem == false) {
            return {
                height: 130,
                justifyContent: 'center',
                alignItems: 'center',
                width: '90%',
                flexDirection: 'column',
            }
        }
        if (this.state.endpoint == false || this.state.lastItem == true) {
            return {
                height: 100,
                justifyContent: 'center',
                alignItems: 'center',
                width: '90%',
                flexDirection: 'column',
            }
        }
    }

    render() {
        return (
            <View style={this.twigStyle()}>
                <View style={styles.trackDetails}>
                    <View style={styles.sectionsDetails}>
                        <View style={styles.timeDetails}>
                            <Text
                                style={{marginRight: 8}}> {Helper.renderFormattedDate(this.state.section.start.timestamp, "HH:mm")} </Text>
                            {this.state.endpoint ?
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
                            {this.state.endpoint ?
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
                                        style={{
                                            fontWeight: 'bold',
                                            marginRight: 35
                                        }}>{Helper.renderRoundedTime(this.state.section.duration)}</Text>
                                    {this.state.section.transportMode !== 'STATIONARY' ? <Text
                                        style={{fontWeight: 'bold'}}>{Helper.renderRoundedDistance(this.state.section.distance)}</Text> : null}
                                </Right>
                            </View>
                            {this.state.lastItem == false &&
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                width: '64%'
                            }}>
                                <Text style={{paddingTop: 3}}>Track Splitten?</Text>
                                <Form>
                                    <View style={{backgroundColor: '#e0eeee', marginLeft: 10}}>
                                        <Picker
                                            style={{width: 100, height: 30, backgroundColor: '#e0eeee'}}
                                            supportedOrientations={['portrait', 'landscape']}
                                            iosHeader="Wähle..."
                                            mode="dropdown"
                                            selectedValue={this.state.sectionmode}
                                            itemStyle={{textAlign: 'center'}}
                                            onValueChange={this.onValueChange.bind(this)}>
                                            <Picker.Item label="NEIN" value="DEFAULT"/>
                                            <Picker.Item label="JA" value="ENDE"/>
                                        </Picker>
                                    </View>
                                </Form>
                            </View>
                            }
                            {this.state.endpoint ? <Text style={{
                                    color: '#4e4e4e',
                                    fontSize: 10,
                                    fontFamily: 'Hind-SemiBold',
                                    marginLeft: 2
                                }}>{this.state.section.end.name}</Text> :
                                <View style={{alignItems: 'flex-start', justifyContent: 'flex-start', marginLeft: 2}}/>}
                        </View>
                    </View>
                </View>
                {this.state.endpoint == true && this.state.lastItem == false &&
                <View style={{width: '100%'}}>
                    <View style={{borderTopWidth: 1, borderTopColor: '#8b8b8b', margin: 14}}/>
                </View>
                }
            </View>
        )
    }
}
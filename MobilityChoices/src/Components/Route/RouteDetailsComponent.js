import React, {Component} from 'react';
import {View} from 'react-native';
import {ListItem, Text} from 'native-base';
import Helper from '../../Lib/HelperAPI';
import {styles} from '../../Styles/GlobalStyles';

export default class RouteDetailsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            section: this.props.section,
            departureTime: "",
            arrivalTime: "",
            date: "",
            lastItem: this.props.lastItem
        };
    }

    renderName() {
        if (this.state.section.type === "train" || this.state.section.type === "bus") {
            return (
                <Text style={{marginBottom: 3, fontFamily: 'Hind-Regular'}}>{this.state.section.name}</Text>
            );
        } else {
            return (
                <Text/>
            );
        }
    }

    componentDidMount() {
        this.renderTimeAndDate();
    }

    renderTimeAndDate() {
        if (this.state.section.type === "train" || this.state.section.type === "bus") {
            var str_d = this.state.section.departureTime;
            var str_a = this.state.section.arrivalTime;
            var stringArray_d = str_d.split(/(\s+)/);
            var stringArray_a = str_a.split(/(\s+)/);
            //date
            var date = stringArray_d[0];
            var dateArray = date.split("-");
            var newDate = " (" + dateArray[2] + "-" + dateArray[1] + ")";
            this.setState({date: newDate});
            //departureTime
            var departureTime = stringArray_d[2];
            var departurTimeArray = departureTime.split(":");
            var newDepartureTime = departurTimeArray[0] + ":" + departurTimeArray[1];
            this.setState({departureTime: newDepartureTime});
            //arrivalTime
            var arrivalTime = stringArray_a[2];
            var arrivalTimeArray = arrivalTime.split(":");
            var newArrivalTime = arrivalTimeArray[0] + ":" + arrivalTimeArray[1];
            this.setState({arrivalTime: newArrivalTime});
        }
    }

    renderDate() {
        return <Text>{this.state.date}</Text>
    }

    renderSectionEndView(arrivalOrDeparture) {
        if (this.state.section.type === "train" || this.state.section.type === "bus") {
            if (arrivalOrDeparture === "Abfahrt") {
                return (
                    <View>
                        <Text style={{marginLeft: 3, fontFamily: 'Hind-SemiBold', color: '#4e4e4e', fontSize: 14}}>Abfahrt:
                            <Text style={{
                                marginLeft: 0,
                                fontFamily: 'Hind-Medium',
                                color: '#4e4e4e',
                                fontSize: 14
                            }}> {this.state.departureTime}</Text>
                        </Text>
                    </View>
                );
            } else {
                return (
                    <View>
                        <Text style={{marginLeft: 3, fontFamily: 'Hind-SemiBold', color: '#4e4e4e', fontSize: 14}}>Ankunft:
                            <Text style={{
                                marginLeft: 0,
                                fontFamily: 'Hind-Medium',
                                color: '#4e4e4e',
                                fontSize: 14
                            }}> {this.state.arrivalTime}</Text>
                        </Text>
                    </View>
                );
            }
        } else {
            return null;
        }
    }

    render() {
        return (
            <ListItem>
                <View style={styles.trackDetails}>
                    <View style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: 82}}>
                        <View style={{flexDirection: "column", alignItems: 'center'}}>
                            {this.renderName()}
                            {Helper.renderIconForType(this.state.section.type)}
                        </View>
                        {Helper.renderRoundedTime(this.state.section.duration)}
                    </View>
                    <View style={styles.sectionsDetails}>
                        <View style={styles.routeDetails}>
                            <View style={styles.line}/>
                            <View style={styles.circleDetails}/>
                            {this.state.lastItem ?
                                <View style={styles.circleEndDetails}><View style={styles.blackInnerCircle}/></View> :
                                <View style={styles.circleEndDetails}/>}
                        </View>
                    </View>
                    <View style={styles.sectionsDetails}>
                        <View style={styles.transportModesDetails}>
                            <View style={{alignItems: 'flex-start', justifyContent: 'flex-start', flex: 1}}>
                                <View>
                                    <Text style={{
                                        marginLeft: 3,
                                        fontFamily: 'Hind-SemiBold',
                                        color: '#4e4e4e',
                                        fontSize: 10
                                    }}>{this.state.section.from.name}</Text>
                                </View>
                                {this.renderSectionEndView("Abfahrt")}
                            </View>
                            <View style={{alignItems: 'flex-start', justifyContent: 'flex-end', flex: 1}}>
                                <View>
                                    <Text style={{
                                        marginLeft: 3,
                                        fontFamily: 'Hind-SemiBold',
                                        color: '#4e4e4e',
                                        fontSize: 10
                                    }}>{this.state.section.to.name}</Text>
                                </View>
                                {this.renderSectionEndView("Ankunft")}
                            </View>
                        </View>
                    </View>
                </View>
            </ListItem>
        )
    }
}
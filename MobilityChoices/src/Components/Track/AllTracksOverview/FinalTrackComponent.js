import React, {Component} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Left, Right, Text} from 'native-base';
import Helper from '../../../Lib/HelperAPI';
import {styles} from '../../../Styles/GlobalStyles';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import fontelloConfig from '../../../IconConfig/config.json';

const Icon = createIconSetFromFontello(fontelloConfig);

export default class FinalTrackComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            track: this.props.track,
        };
    }

    renderIcons() {
        var nameFirst = "health";
        var colorFirst = this.state.track.evaluation.iconcolor.health;
        var nameSecond = "time";
        var colorSecond = this.state.track.evaluation.iconcolor.time;
        var nameThird = "costs";
        var colorThird = this.state.track.evaluation.iconcolor.costs;
        var nameFourth = "environment";
        var colorFourth = this.state.track.evaluation.iconcolor.environment;
        return (
            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                {this.renderIconsForType(nameFirst, colorFirst)}
                {this.renderIconsForType(nameSecond, colorSecond)}
                {this.renderIconsForType(nameThird, colorThird)}
                {this.renderIconsForType(nameFourth, colorFourth)}
            </View>

        )
    }

    renderIconsForType(name, color) {
        switch (name) {
            case 'health':
                switch (color) {
                    case 'colored':
                        return (
                            <Icon name='icon_gesundheit'
                                  style={{fontSize: 20, color: '#FF5F7C', marginRight: 5}}/>
                        );
                    case 'lightGrey':
                        return (
                            <Icon name='icon_gesundheit'
                                  style={{fontSize: 20, color: '#cfd9d9', marginRight: 5}}/>
                        );
                    case 'darkGrey':
                        return (
                            <Icon name='icon_gesundheit'
                                  style={{fontSize: 20, color: '#8b8b8b', marginRight: 5}}/>
                        );
                }

                break;
            case 'environment':
                switch (color) {
                    case 'colored':
                        return (
                            <Icon name='icon_umwelt'
                                  style={{fontSize: 20, color: '#B0CE00', marginRight: 5}}/>
                        );
                    case 'lightGrey':
                        return (
                            <Icon name='icon_umwelt'
                                  style={{fontSize: 20, color: '#cfd9d9', marginRight: 5}}/>
                        );
                    case 'darkGrey':
                        return (
                            <Icon name='icon_umwelt'
                                  style={{fontSize: 20, color: '#8b8b8b', marginRight: 5}}/>
                        );
                }

                break;
            case 'time':
                switch (color) {
                    case 'colored':
                        return (
                            <Icon name='icon_zeit'
                                  style={{fontSize: 20, color: '#FFC200', marginRight: 5}}/>
                        );
                    case 'lightGrey':
                        return (
                            <Icon name='icon_zeit'
                                  style={{fontSize: 20, color: '#cfd9d9', marginRight: 5}}/>
                        );
                    case 'darkGrey':
                        return (
                            <Icon name='icon_zeit'
                                  style={{fontSize: 20, color: '#8b8b8b', marginRight: 5}}/>
                        );
                }

                break;
            case 'costs':
                switch (color) {
                    case 'colored':
                        return (
                            <Icon name='icon_kosten'
                                  style={{fontSize: 20, color: '#78D1C0', marginRight: 5}}/>
                        );
                    case 'lightGrey':
                        return (
                            <Icon name='icon_kosten'
                                  style={{fontSize: 20, color: '#cfd9d9', marginRight: 5}}/>
                        );
                    case 'darkGrey':
                        return (
                            <Icon name='icon_kosten'
                                  style={{fontSize: 20, color: '#8b8b8b', marginRight: 5}}/>
                        );
                }

                break;

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
                    <View
                        style={{backgroundColor: '#0099ff', height: 2, position: 'absolute', left: 0, right: 0}}/>
                    <View style={styles.circle}/>
                    {finalSections.length - 1 === index ? <View style={styles.circleEnd}/> : null}
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
                        <Text style={{fontFamily: 'Hind-Regular'}}>...</Text>
                    </View>
                )
            }
            return (
                <View style={styles.time} key={index}>
                    <Text> {Helper.renderRoundedTime(item.duration)} </Text>
                </View>
            )
        });
        return (
            <View>
                <TouchableOpacity onPress={() => this.props.navigation.navigate({
                    key: 'FinalDetails',
                    routeName: 'FinalDetails',
                    params: {
                        item: this.state.track,
                        track: this.state.track.sections,
                        refresh: this.props.refresh,
                        remove: this.props.remove
                    }
                })} style={{margin: 20}}>
                    <View style={{flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center'}}>
                        <Left style={{flex: 2}}>
                            <View style={{
                                flex: 1,
                                alignItems: 'flex-start',
                                flexDirection: 'column'
                            }}>
                                <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                                    <Text style={{
                                        fontSize: 20,
                                        fontFamily: 'Hind-SemiBold',
                                        color: '#4e4e4e'
                                    }}> {this.state.track.name} </Text>
                                    <View style={{marginLeft: 6}}>
                                        {Helper.renderFormattedDate(this.state.track.date, "DD.MM.YYYY")}
                                    </View>
                                </View>

                            </View>
                        </Left>
                        <Right style={{flex: 1}}>
                            {!this.state.track.evaluation || !this.state.track.evaluation.iconcolor ?
                                <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                                    <Icon name="icon_gesundheit" color="#cfd9d9"
                                          style={{marginRight: 5, fontSize: 20}}/>
                                    <Icon name="icon_zeit" color="#cfd9d9" style={{marginRight: 5, fontSize: 20}}/>
                                    <Icon name="icon_kosten" color="#cfd9d9" style={{marginRight: 5, fontSize: 20}}/>
                                    <Icon name="icon_umwelt" color="#cfd9d9" style={{marginRight: 5, fontSize: 20}}/>
                                </View>
                                : this.renderIcons()}
                        </Right>
                    </View>
                </TouchableOpacity>
                <View style={{borderTopWidth: 0.7, borderTopColor: '#b3bbbb', marginLeft: 15, marginRight: 15}}/>
            </View>
        )
    }
}
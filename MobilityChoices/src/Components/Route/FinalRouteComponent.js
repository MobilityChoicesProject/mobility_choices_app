import React, {Component} from 'react';
import {View} from 'react-native';
import {Content, ListItem, Spinner, Text} from 'native-base';
import Helper from '../../Lib/HelperAPI';
import RealmAPI from '../../Lib/RealmAPI';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import fontelloConfig from '../../IconConfig/config.json';
import {styles} from '../../Styles/GlobalStyles';

const Icon = createIconSetFromFontello(fontelloConfig);

export default class FinalRouteComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            track: this.props.track,
            first: '',
            second: '',
            third: '',
            fourth: '',
            loaded: false,
            isLoading: false,
            email: ''
        };
    }

    async componentWillMount() {
        var loginData = RealmAPI.getLoginData();
        var firstIcon = this.getIcon("health");
        var secondIcon = this.getIcon("time");
        var thirdIcon = this.getIcon("cost");
        var fourthIcon = this.getIcon("env");


        this.setState({
            email: loginData.email,
            first: firstIcon,
            second: secondIcon,
            third: thirdIcon,
            fourth: fourthIcon,
            loaded: true
        });
    }

    getColor(color) {
        switch (color) {
            case "green":
                return "#00FF00";
            case "red":
                return "#FF0000";
            case "yellow":
                return "#FFFF00";
            default:
                return "#000";
        }
    }

    getIcon(pref) {
        var icon = [];
        switch (pref) {
            case 'health':
                icon[0] = "heart-pulse";
                icon[1] = this.getColor(this.state.track.evaluation.iconcolor.health.toString());
                return icon;
            case 'cost':
                icon[0] = "logo-euro";
                icon[1] = this.getColor(this.state.track.evaluation.iconcolor.costs.toString());
                return icon;
            case 'time':
                icon[0] = "clock";
                icon[1] = this.getColor(this.state.track.evaluation.iconcolor.time.toString());
                return icon;
            case 'env':
                icon[0] = "leaf";
                icon[1] = this.getColor(this.state.track.evaluation.iconcolor.enviroment.toString());
                return icon;
        }
    }

    renderIcons() {
        var nameFirst = this.state.first[0].toString();
        var colorFirst = this.state.first[1].toString();
        var nameSecond = this.state.second[0].toString();
        var colorSecond = this.state.second[1].toString();
        var nameThird = this.state.third[0].toString();
        var colorThird = this.state.third[1].toString();
        var nameFourth = this.state.fourth[0].toString();
        var colorFourth = this.state.fourth[1].toString();
        return (
            <View style={{flex: 1, flexDirection: 'row'}}>
                {this.renderIconsForType(nameFirst, colorFirst)}
                {this.renderIconsForType(nameSecond, colorSecond)}
                {this.renderIconsForType(nameThird, colorThird)}
                {this.renderIconsForType(nameFourth, colorFourth)}
            </View>

        )
    }

    renderIconsForType(name, color) {
        switch (name) {
            case 'heart-pulse':
                switch (color) {
                    case '#00FF00':
                        return (
                            <Icon name='icon_gesundheit'
                                  style={{fontSize: 20, color: '#FF5F7C', marginRight: 5, marginTop: 21}}/>
                        );
                    case '#FF0000':
                        return (
                            <Icon name='icon_gesundheit'
                                  style={{fontSize: 20, color: '#cfd9d9', marginRight: 5, marginTop: 21}}/>
                        );
                    case '#FFFF00':
                        return (
                            <Icon name='icon_gesundheit'
                                  style={{fontSize: 20, color: '#8b8b8b', marginRight: 5, marginTop: 21}}/>
                        );
                }

                break;
            case 'leaf':
                switch (color) {
                    case '#00FF00':
                        return (
                            <Icon name='icon_umwelt'
                                  style={{fontSize: 20, color: '#B0CE00', marginRight: 5, marginTop: 21}}/>
                        );
                    case '#FF0000':
                        return (
                            <Icon name='icon_umwelt'
                                  style={{fontSize: 20, color: '#cfd9d9', marginRight: 5, marginTop: 21}}/>
                        );
                    case '#FFFF00':
                        return (
                            <Icon name='icon_umwelt'
                                  style={{fontSize: 20, color: '#8b8b8b', marginRight: 5, marginTop: 21}}/>
                        );
                }

                break;
            case 'clock':
                switch (color) {
                    case '#00FF00':
                        return (
                            <Icon name='icon_zeit'
                                  style={{fontSize: 20, color: '#FFC200', marginRight: 5, marginTop: 21}}/>
                        );
                    case '#FF0000':
                        return (
                            <Icon name='icon_zeit'
                                  style={{fontSize: 20, color: '#cfd9d9', marginRight: 5, marginTop: 21}}/>
                        );
                    case '#FFFF00':
                        return (
                            <Icon name='icon_zeit'
                                  style={{fontSize: 20, color: '#8b8b8b', marginRight: 5, marginTop: 21}}/>
                        );
                }

                break;
            case 'logo-euro':
                switch (color) {
                    case '#00FF00':
                        return (
                            <Icon name='icon_kosten'
                                  style={{fontSize: 20, color: '#78D1C0', marginRight: 5, marginTop: 21}}/>
                        );
                    case '#FF0000':
                        return (
                            <Icon name='icon_kosten'
                                  style={{fontSize: 20, color: '#cfd9d9', marginRight: 5, marginTop: 21}}/>
                        );
                    case '#FFFF00':
                        return (
                            <Icon name='icon_kosten'
                                  style={{fontSize: 20, color: '#8b8b8b', marginRight: 5, marginTop: 21}}/>
                        );
                }

                break;

        }
    }

    handleCallback = () => {
        this.setState({isLoading: false});
    }

    loadDetails = () => {
        //this.setState({ isLoading: true });
        this.props.navigation.navigate('RouteDetails', {item: this.state.track, callback: this.handleCallback});
    }

    render() {
        var sections1 = this.state.track.sections;
        var sections2 = [];
        if (sections1.length >= 4) {
            var fillin = {type: "fillin", duration: "..."};
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

        const sections = finalSections.map((item) => {
            return (
                <View style={styles.route} key={item.key}>
                    <View style={{backgroundColor: '#4e4e4e', height: 2, position: 'absolute', left: 0, right: 0}}/>
                    <View style={styles.circle}/>
                    {index - 1 === item.key ?
                        <View style={styles.circleEnd}><View style={styles.blackInnerCircle}/></View> : null}
                </View>

            )
        });
        const transportModes = finalSections.map((item) => {
            return (
                <View style={styles.transportModes} key={item.key}>
                    {Helper.renderIconForType(item.type)}
                </View>
            )
        });
        const time = finalSections.map((item) => {
            if (item.duration == "...") {
                return (
                    <View style={styles.time} key={item.key}>
                        <Text style={{fontFamily: 'Hind-Regular'}}>...</Text>
                    </View>
                )
            }
            var duration = Helper.renderRoundedTime(item.duration);
            return (
                <View style={styles.time} key={item.key}>
                    <Text style={{fontFamily: 'Hind-Regular'}}>{duration}</Text>
                </View>
            )
        });
        return (
            <Content>
                <ListItem onPress={this.loadDetails}>
                    <View style={{flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{
                            flex: 6,
                            alignItems: 'flex-start',
                            position: 'relative',
                            flexDirection: 'column'
                        }}>
                            <View style={styles.sections}>
                                {transportModes}
                            </View>
                            <View style={styles.sections}>
                                {sections}
                            </View>
                            <View style={styles.sections}>
                                {time}
                            </View>
                        </View>
                        {this.state.isLoading ? <Spinner/> :
                            <View style={{left: 15, right: 0}}>
                                {this.state.loaded === false ? null : this.renderIcons()}
                            </View>
                        }
                    </View>
                </ListItem>
            </Content>
        )
    }
}

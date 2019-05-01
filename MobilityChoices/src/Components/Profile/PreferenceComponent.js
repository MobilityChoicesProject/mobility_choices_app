import React, {Component} from 'react';
import ComponentHelper from '../../Helper/ComponentHelper';
import {Slider, Text, View} from 'react-native';
import {
    Body,
    Left,
    ListItem,
    Right,
} from 'native-base';
import {styles} from '../../Styles/GlobalStyles';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import fontelloConfig from '../../IconConfig/config.json';

const Icon = createIconSetFromFontello(fontelloConfig);

export default class PreferenceComponent extends Component {
    propertiesHaveChanged = true;

    async handleValue(value, valueName) {
        this.propertiesHaveChanged = true;
        await ComponentHelper.updateObjectStateValue(this.props.self, value, 'myProfile', valueName, 'changedProfile');
    }

    async handleTmpValue(value, valueName) {
        this.propertiesHaveChanged = true;
        var tmpUpdaterName = 'tmpValueFor' + valueName;

        ComponentHelper.triggerChangeEvent(this, tmpUpdaterName, value, async () => {
            await this.props.self.setState({[valueName]: this[tmpUpdaterName]});
        });
    }

    updateEnvironmentValue = (value) => {
        this.handleValue(value, 'envValue');
    };

    updateHealthValue = (value) => {
        this.handleValue(value, 'healthValue');
    };

    updateTimeValue = (value) => {
        this.handleValue(value, 'timeValue');
    };

    updateCostValue = (value) => {
        this.handleValue(value, 'costValue');
    };

    updateTmpEnvironmentValue = (value) => {
        this.handleTmpValue(value, 'tmpEnvValue');
    };

    updateTmpHealthValue = (value) => {
        this.handleTmpValue(value, 'tmpHealthValue');
    };

    updateTmpTimeValue = (value) => {
        this.handleTmpValue(value, 'tmpTimeValue');
    };

    updateTmpCostValue = (value) => {
        this.handleTmpValue(value, 'tmpCostValue');
    };

    updateTmpValues() {
        this.props.state.tmpEnvValue = this.props.state.myProfile.envValue;
        this.props.state.tmpHealthValue = this.props.state.myProfile.healthValue;
        this.props.state.tmpTimeValue = this.props.state.myProfile.timeValue;
        this.props.state.tmpCostValue = this.props.state.myProfile.costValue;
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.self.initialized) {
            this.updateTmpValues();

            var currentValue = this.propertiesHaveChanged;
            return currentValue;
        }

        return false;
    }

    componentDidUpdate(prevProps, prevState) {
        ComponentHelper.propertiesHaveChangedTimeout(() => {
            this.propertiesHaveChanged = false;
        });
    }

    render() {
        return (
            <View>
                <ListItem icon>
                    <Left>
                        <Icon name="icon_umwelt" size={30} color="#B0CE00"/>
                    </Left>
                    <Body style={{borderBottomWidth: 0}}>
                    <View style={styles.preferences_profile}>
                        <Slider step={1} value={this.props.state.myProfile.envValue} minimumValue={0} maximumValue={10}
                                style={styles.sliderUmwelt}
                                onSlidingComplete={this.updateEnvironmentValue}
                                onValueChange={this.updateTmpEnvironmentValue}
                                minimumTrackTintColor={'#B0CE00'}
                                thumbTintColor={'#B0CE00'}/>
                    </View>
                    </Body>
                    <Right style={{borderBottomWidth: 0}}>
                        <Text style={styles.labelText}>UMWELT</Text>
                    </Right>
                </ListItem>
                <ListItem icon>
                    <Left>
                        <Icon name="icon_gesundheit" size={24} color="#FF5F7C"/>
                    </Left>
                    <Body style={{borderBottomWidth: 0}}>
                    <View style={styles.preferences_profile}>
                        <Slider step={1} value={this.props.state.myProfile.healthValue} minimumValue={0}
                                maximumValue={10} style={styles.sliderGesundheit}
                                onSlidingComplete={this.updateHealthValue}
                                onValueChange={this.updateTmpHealthValue}
                                minimumTrackTintColor={'#FF5F7C'}
                                thumbTintColor={'#FF5F7C'}/>
                    </View>
                    </Body>
                    <Right style={{borderBottomWidth: 0}}>
                        <Text style={styles.labelText}>GESUNDHEIT</Text>
                    </Right>
                </ListItem>
                <ListItem icon>
                    <Left>
                        <Icon name="icon_zeit" size={27} color="#FFC200"/>
                    </Left>
                    <Body style={{borderBottomWidth: 0}}>
                    <View style={styles.preferences_profile}>
                        <Slider step={1} value={this.props.state.myProfile.timeValue} minimumValue={0} maximumValue={10}
                                style={styles.sliderZeit}
                                onSlidingComplete={this.updateTimeValue}
                                onValueChange={this.updateTmpTimeValue}
                                minimumTrackTintColor={'#FFC200'}
                                thumbTintColor={'#FFC200'}/>
                    </View>
                    </Body>
                    <Right style={{borderBottomWidth: 0}}>
                        <Text style={styles.labelText}>ZEIT</Text>
                    </Right>
                </ListItem>
                <ListItem icon>
                    <Left>
                        <Icon name="icon_kosten" size={27} color="#78D1C0"/>
                    </Left>
                    <Body>
                    <View style={styles.preferences_profile}>
                        <Slider step={1} value={this.props.state.myProfile.costValue} minimumValue={0} maximumValue={10}
                                style={styles.sliderKosten}
                                onSlidingComplete={this.updateCostValue}
                                onValueChange={this.updateTmpCostValue}
                                minimumTrackTintColor={'#78D1C0'}
                                thumbTintColor={'#78D1C0'}/>
                    </View>
                    </Body>
                    <Right>
                        <Text style={styles.labelText}>KOSTEN</Text>
                    </Right>
                </ListItem>
            </View>
        );
    }
}

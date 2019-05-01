import React, {Component} from 'react';
import {View} from 'react-native';
import CheckBox from 'react-native-checkbox';
import {ListItem, Left, Body} from 'native-base';
import ComponentHelper from '../../Helper/ComponentHelper';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import fontelloConfig from '../../IconConfig/config.json';
import {styles} from '../../Styles/GlobalStyles';

const Icon = createIconSetFromFontello(fontelloConfig);


export default class TransportComponent extends Component {
    propertiesHaveChanged = true;

    async handleValue(value, valueName) {
        this.propertiesHaveChanged = true;
        await ComponentHelper.updateObjectStateValue(this.props.self, value, 'myProfile', valueName, 'changedProfile');
    }

    updateBikeValue = (checked) => {
        this.handleValue(!checked, 'bike');
    };

    updateEbikeValue = (checked) => {
        this.handleValue(!checked, 'ebike');
    };

    updateTrainValue = (checked) => {
        this.handleValue(!checked, 'train');
    };

    updateBusValue = (checked) => {
        this.handleValue(!checked, 'bus');
    };

    updateMotorbikeValue = (checked) => {
        this.handleValue(!checked, 'motorbike');
    };

    updateCarValue = (checked) => {
        this.handleValue(!checked, 'car');
    };

    updateECarValue = (checked) => {
        this.handleValue(!checked, 'ecar');
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.self.initialized) {
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
                    <Left style={{width: 50}}>
                        <Icon name="icon_verkehrsmittel_fahrrad" size={16} color="black"/>
                    </Left>
                    <Body style={{borderBottomWidth: 0}}>
                    <CheckBox
                        label="Fahrrad"
                        labelStyle={styles.checkBoxLabel}
                        checked={this.props.state.myProfile.bike}
                        onChange={this.updateBikeValue}
                    />
                    </Body>

                </ListItem>
                <ListItem icon>
                    <Left style={{width: 50}}>
                        <Icon name="icon_verkehrsmittel_elektrofahrrad" size={16} color="black"/>
                    </Left>
                    <Body style={{borderBottomWidth: 0}}>
                    <CheckBox
                        label="Elektro-Fahrrad"
                        labelStyle={styles.checkBoxLabel}
                        checked={this.props.state.myProfile.ebike}
                        onChange={this.updateEbikeValue}
                    />
                    </Body>
                </ListItem>
                <ListItem icon>
                    <Left style={{width: 50}}>
                        <Icon name="icon_verkehrsmittel_bahn" size={16} color="black"/>
                    </Left>
                    <Body style={{borderBottomWidth: 0}}>
                    <CheckBox
                        label="Bahn"
                        labelStyle={styles.checkBoxLabel}
                        checked={this.props.state.myProfile.train}
                        onChange={this.updateTrainValue}
                    />
                    </Body>
                </ListItem>
                <ListItem icon>
                    <Left style={{width: 50}}>
                        <Icon name="icon_verkehrsmittel_bus" size={16} color="black"/>
                    </Left>
                    <Body style={{borderBottomWidth: 0}}>
                    <CheckBox
                        label="Bus"
                        labelStyle={styles.checkBoxLabel}
                        checked={this.props.state.myProfile.bus}
                        onChange={this.updateBusValue}
                    />
                    </Body>
                </ListItem>
                <ListItem icon>
                    <Left style={{width: 50}}>
                        <Icon name="icon_verkehrsmittel_motorrad" size={16} color="black"/>
                    </Left>
                    <Body style={{borderBottomWidth: 0}}>
                    <CheckBox
                        label="Motorrad"
                        labelStyle={styles.checkBoxLabel}
                        checked={this.props.state.myProfile.motorbike}
                        onChange={this.updateMotorbikeValue}
                    />
                    </Body>
                </ListItem>
                <ListItem icon>
                    <Left style={{width: 50}}>
                        <Icon name="icon_verkehrsmittel_auto" size={16} color="black"/>
                    </Left>
                    <Body style={{borderBottomWidth: 0}}>
                    <CheckBox
                        label="Auto"
                        labelStyle={styles.checkBoxLabel}
                        checked={this.props.state.myProfile.car}
                        onChange={this.updateCarValue}
                    />
                    </Body>
                </ListItem>
                <ListItem icon>
                    <Left style={{width: 50}}>
                        <Icon name="icon_verkehrsmittel_elektroauto" size={16} color="black"/>
                    </Left>
                    <Body style={{borderBottomWidth: 0}}>
                    <CheckBox
                        label="Elektro-Auto"
                        labelStyle={styles.checkBoxLabel}
                        checked={this.props.state.myProfile.ecar}
                        onChange={this.updateECarValue}
                    />
                    </Body>
                </ListItem>
            </View>
        );
    }
}

import React, {Component} from 'react';
import {View} from 'react-native';
import CheckBox from 'react-native-checkbox';
import RealmAPI from "../../Lib/RealmAPI";
import ObjectHelper from "../../Helper/ObjectHelper";

export default class UserGroupComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groupindex: this.props.groupindex,
            group: this.props.group
        };
    }

    onValueChange = async () => {

        var newgroup = Object.assign({}, this.state.group);
        newgroup.joined = !newgroup.joined;
        await this.setState({group: newgroup});

        try {
            var realmObj = await RealmAPI.getUsergroups();
            console.warn(realmObj);
            var obj = await ObjectHelper.deepCopyRealm({}, realmObj);
            obj[this.state.groupindex] = this.state.group;
            await RealmAPI.saveUsergroups(Object.values(obj));
        } catch (error) {
            console.log("Error loading data" + error);
        }
    };

    render() {
        return (
            <View>
                <CheckBox
                    label={this.state.group.name}
                    checked={this.state.group.joined}
                    containerStyle={{width: '100%', height: 50, marginLeft: 10}}
                    onChange={this.onValueChange}/>
            </View>
        )
    }
}
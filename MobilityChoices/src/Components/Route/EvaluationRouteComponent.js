import React, {Component} from 'react';
import {Linking, Text, TouchableOpacity, View} from 'react-native';
import {Col, Grid, Row} from 'native-base';
import Helper from '../../Lib/HelperAPI';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import fontelloConfig from '../../IconConfig/config.json';
import {styles} from '../../Styles/GlobalStyles';
import RealmAPI from '../../Lib/RealmAPI';

const Icon = createIconSetFromFontello(fontelloConfig);

export default class EvaluationRouteComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            evaluation: this.props.data,
            route: this.props.route,
            userCountry: ""
        };
    }

    componentDidMount() {
        this.retrieveUserCountry();
    }

    onPress100() {
        var url = "https://www.eingutertag.org/de/";
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                Alert.alert('Vorgang wird nicht unterstützt');
                return null;
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => Alert.alert('Es ist ein Fehler aufgetreten'));
    }

    renderEnvironment() {
        //because someone spelled "environment" wrong for routes on the server
        if (this.state.route) {
            return <Text style={{
                color: '#4e4e4e',
                fontFamily: 'Hind-SemiBold',
                fontSize: 14
            }}>{Math.round(this.state.evaluation.values.enviroment)} Punkte</Text>
        } else {
            if (!this.state.evaluation || !this.state.evaluation.values) {
                return <Text style={{
                    color: '#4e4e4e',
                    fontFamily: 'Hind-SemiBold',
                    fontSize: 14
                }}>?</Text>
            } else {
                return <Text style={{
                    color: '#4e4e4e',
                    fontFamily: 'Hind-SemiBold',
                    fontSize: 14
                }}>{Math.round(this.state.evaluation.values.environment)} Punkte</Text>

            }
        }
    }

    retrieveUserCountry() {
        RealmAPI.loadUserCountry().then(country => {
            console.log("UserCountry: " + country);
            this.setState({userCountry: country});
        });
    }

    render() {
        return (
            <View style={styles.evaluation}>
                <Grid style={{width: '100%'}}>
                    <Row style={{marginBottom: 5}}>
                        <Col>
                            <View style={styles.evaluationItem}>
                                <Icon name="icon_gesundheit" style={{color: '#FF5F7C', fontSize: 27, marginBottom: 5}}/>
                                <Text style={{
                                    color: '#4e4e4e',
                                    fontFamily: 'Hind-SemiBold',
                                    fontSize: 14
                                }}>{!this.state.evaluation || !this.state.evaluation.values ? "?" : Math.round(this.state.evaluation.values.health)}</Text>
                            </View>
                        </Col>
                        <Col>
                            <View style={styles.evaluationItem}>
                                <Icon name="icon_zeit" style={{color: '#FFC200', fontSize: 27, marginBottom: 5}}/>
                                <Text>{!this.state.evaluation || !this.state.evaluation.values ? "?" : Helper.renderRoundedTime(this.state.evaluation.values.time)}</Text>
                            </View>
                        </Col>
                        <Col>
                            <View style={styles.evaluationItem}>
                                <Icon name="icon_kosten" style={{color: '#78D1C0', fontSize: 27, marginBottom: 5}}/>
                                <Text style={{
                                    color: '#4e4e4e',
                                    fontFamily: 'Hind-SemiBold',
                                    fontSize: 14
                                }}>{!this.state.evaluation || !this.state.evaluation.values ? "?" : Helper.renderCostsDependingOnCountry(this.state.evaluation.values.costs, this.state.userCountry)}</Text>
                            </View>
                        </Col>
                        <Col>
                            <View style={styles.evaluationItem}>
                                <Icon name="icon_umwelt" style={{color: '#B0CE00', fontSize: 27, marginBottom: 5}}/>
                                {this.renderEnvironment()}
                            </View>
                        </Col>
                    </Row>
                    <Row>
                        <TouchableOpacity onPress={this.onPress100} style={{width: '100%'}}>
                            <View style={{alignItems: 'flex-end', marginRight: 15}}>
                                <Text style={{fontFamily: 'Hind-Medium', color: '#8b8b8b', fontSize: 10}}>Ein guter Tag
                                    hat 100 Punkte.</Text>
                            </View>
                        </TouchableOpacity>
                    </Row>
                </Grid>
            </View>
        )
    }
}

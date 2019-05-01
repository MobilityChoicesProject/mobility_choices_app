import React, {Component} from 'react';
import {View, Platform, Text, TouchableOpacity, ScrollView} from 'react-native';
import {
    Button,
    Container,
    Content,
    List
} from 'native-base';
import MapComponentRoute from '../../Components/Map/Small/MapComponentRoute';
import FullscreenMapComponentRoute from '../../Components/Map/Fullscreen/FullscreenMapComponentRoute';
import EvaluationRouteComponent from '../../Components/Route/EvaluationRouteComponent';
import RouteDetailsComponent from '../../Components/Route/RouteDetailsComponent';
import {styles} from '../../Styles/GlobalStyles';
import Menu from "../../Components/Menu/Menu";
import Modal from "react-native-modal";
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import fontelloConfig from '../../IconConfig/config.json';

const Icon = createIconSetFromFontello(fontelloConfig);
import {getFullScreenModalStyle, getHeaderStyle} from "../../Helper/IphoneXHelper";


export default class RouteDetails extends Component {
    static navigationOptions = ({navigation}) => ({
        title: 'DETAILS ROUTE',
        headerTitleStyle: {
            alignSelf: (Platform.OS === 'android') ? 'flex-end' : 'center',
            fontFamily: 'Hind-Medium',
            color: '#4e4e4e'
        },
        headerBackTitle: null,
        headerBackImage: require('../../../resources/icons/icon_back.png'),
        headerStyle: getHeaderStyle()
    });

    constructor(props) {
        super(props);
        this.state = {
            title: 'Details Route',
            route: this.props.navigation.state.params.item,
            isDetailsCollapsed: false,
            isMyTrackMapCollapsed: false,
            isModalVisible: false,
            isInfoModalVisible: false
        };
    }

    _toggleModal = () =>
        this.setState({isModalVisible: !this.state.isModalVisible});

    goBack() {
        this.props.navigation.state.params.callback();
        this.props.navigation.goBack();
    }

    _toggleInfoModal = () => {
        this.setState({isInfoModalVisible: !this.state.isInfoModalVisible});
    }

    render() {
        const lastItem = this.state.route.sections[this.state.route.sections.length - 1];
        const tmpSections = this.state.route.sections.slice(0, this.state.route.sections.length - 1);

        return (
            <Container>
                <View>
                    <Modal isVisible={this.state.isInfoModalVisible} onBackdropPress={() => this._toggleModal()}>
                        <View style={styles.modalContent}>
                            <Text style={{
                                fontSize: 16,
                                fontFamily: 'Hind-Bold',
                                color: '#4e4e4e',
                                marginTop: 10
                            }}>{'WAS BEDEUTEN DIE WERTE?'}</Text>
                            <ScrollView>
                                <View style={{margin: 10, alignContent: 'center'}}>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            marginRight: 20,
                                            fontFamily: 'Hind-Medium',
                                            color: '#4e4e4e'
                                        }}>{'Unter den Symbolen sehen Sie jeweils die Werte, die für diese Route berechnet wurden.'}</Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Icon name='icon_gesundheit'
                                          style={{fontSize: 20, color: '#FF5F7C', marginRight: 5}}/>
                                    <Text style={{
                                        fontSize: 14,
                                        marginBottom: 5,
                                        marginRight: 30,
                                        fontFamily: 'Hind-Medium',
                                        color: '#4e4e4e'
                                    }}>{'Je höher der Gesundheitswert (Werte zwischen 0 und 10), desto mehr tragen Sie zu Ihrer Gesundheit bei, wenn Sie diese Route wählen.'}</Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Icon name='icon_zeit'
                                          style={{fontSize: 20, color: '#FFC200', marginRight: 5}}/>
                                    <Text style={{
                                        fontSize: 14,
                                        marginRight: 30,
                                        fontFamily: 'Hind-Medium',
                                        color: '#4e4e4e'
                                    }}>{'Die Zeit gibt ca. an, wie lange Sie insgesamt für diese Route benötigen.'}</Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Icon name='icon_kosten'
                                          style={{fontSize: 20, color: '#78D1C0', marginRight: 5}}/>
                                    <Text style={{
                                        fontSize: 14,
                                        marginRight: 30,
                                        fontFamily: 'Hind-Medium',
                                        color: '#4e4e4e'
                                    }}>{'Dieser Wert gibt an, mit wie vielen Kosten Sie bei dieser Route ungefähr rechnen müssen.' +
                                    'Die Berechnung der Kosten erfolgt aufgrund von Durchschnittswerten in ganz Österreich/Schweiz/Deutschland. ' +
                                    'Die geschätzten Preise können also von den tatsächlichen Preisen abweichen.'}</Text>
                                </View>
                                <View style={{flexDirection: 'column'}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Icon name='icon_umwelt'
                                              style={{fontSize: 20, color: '#B0CE00', marginRight: 5}}/>
                                        <Text style={{
                                            fontSize: 14,
                                            marginBottom: 5,
                                            marginRight: 30,
                                            fontFamily: 'Hind-Medium',
                                            color: '#4e4e4e'
                                        }}>{'Für den Umwelt-Wert gilt, je weniger Punkte desto besser. ' +
                                        'Genauere Informationen erhalten Sie, indem Sie auf "Ein guter Tag hat 100 Punkte" klicken.'}</Text>
                                    </View>
                                </View>
                            </ScrollView>
                            <View style={{width: "100%"}}>
                                <TouchableOpacity onPress={this._toggleInfoModal}>
                                    <View style={styles.modalbutton1}>
                                        <Text style={styles.buttonText}>{'VERSTANDEN'}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
                <Content contentContainerStyle={{
                    backgroundColor: '#fff'
                }}>
                    <View style={{width: '100%', alignItems: 'flex-end'}}>
                        <TouchableOpacity
                            style={{
                                width: 17,
                                backgroundColor: '#4e4e4e',
                                borderRadius: 40,
                                marginRight: 30,
                                marginTop: 15,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onPress={() => this._toggleInfoModal()}>
                            <Text style={{fontSize: 12, color: '#fff'}}>?</Text>
                        </TouchableOpacity>
                    </View>
                    <EvaluationRouteComponent data={this.state.route.evaluation} route={true}/>
                    <View style={{borderTopWidth: 1, borderTopColor: '#a6aeae', marginLeft: 14, marginRight: 14}}/>
                    <View style={{marginBottom: 15}}>
                        <List dataArray={tmpSections}
                              renderRow={(item) =>
                                  <RouteDetailsComponent section={item} navigation={this.props.navigation}
                                                         lastItem={false}/>
                              }/>
                        <RouteDetailsComponent section={lastItem} navigation={this.props.navigation} lastItem={true}/>
                    </View>
                    <Button style={styles.blueButtonCenter} full rounded primary
                            onPress={this._toggleModal}>
                        <Text style={styles.buttonText}>KARTE VERGRÖSSERN</Text>
                    </Button>
                    <MapComponentRoute track={this.state.route}/>
                    <View>
                        <Modal isVisible={this.state.isModalVisible}
                               onBackButtonPress={() => this._toggleModal()}
                        >
                            <View style={getFullScreenModalStyle()}>
                                <TouchableOpacity onPress={this._toggleModal} style={{backgroundColor: '#ffff'}}>
                                    <MaterialIcon name="arrow-left" size={25} color="black"/>
                                </TouchableOpacity>
                                <FullscreenMapComponentRoute track={this.state.route}/>
                            </View>
                        </Modal>
                    </View>
                </Content>
                <Menu navigation={this.props.navigation}/>
            </Container>
        )
    }
}

import React, {Component} from 'react';
import {Platform, ScrollView, Text} from 'react-native';
import {Container, Content} from 'native-base';
import {styles} from '../../Styles/GlobalStyles';
import {getHeaderStyle} from "../../Helper/IphoneXHelper";

export default class AppNotice extends Component {
    static navigationOptions = ({navigation}) => ({
        title: 'IMPRESSUM',
        headerTitleStyle: {
            alignSelf: (Platform.OS === 'android') ? 'flex-end' : 'center',
            fontFamily: 'Hind-Medium',
            color: '#4e4e4e'
        },
        headerBackTitle: null,
        headerBackImage: require('../../../resources/icons/icon_back.png'),
        headerStyle: getHeaderStyle()
    });

    render() {
        return (
            <Container style={{backgroundColor: '#fff'}}>
                <Content contentContainerStyle={{
                    flex: 1,
                    margin: 10,
                    backgroundColor: '#fff'
                }}>
                    <ScrollView>
                        <Text style={styles.privacyPolicyText}>
                            Angaben gemäß § 25 Mediengesetz und Information gemäß § 5 E-Commerce-Gesetz:{"\n"}{"\n"}

                            Fachhochschule Vorarlberg GmbH{"\n"}
                            Campus V{"\n"}
                            Hochschulstraße 1{"\n"}
                            6850 Dornbirn{"\n"}
                            Österreich{"\n"}{"\n"}

                            +43 5572 792{"\n"}
                            +43 5572 792 9500{"\n"}
                            info@fhv.at{"\n"}{"\n"}

                            Firmenbuchnummer: FN 165415h{"\n"}
                            Firmenbuchgericht Feldkirch{"\n"}
                            UID: ATU 38076103{"\n"}
                            DVR 0752614{"\n"}
                            EORI: ATEOS1000019493{"\n"}{"\n"}
                        </Text>
                        <Text style={styles.privacyPolicyHeading}>
                            GESCHÄFTSFÜHRUNG{"\n"}
                        </Text>
                        <Text style={styles.privacyPolicyText}>
                            Mag. Stefan Fitz-Rankl{"\n"}{"\n"}
                        </Text>
                        <Text style={styles.privacyPolicyHeading}>
                            EIGENTÜMER{"\n"}
                        </Text>
                        <Text style={styles.privacyPolicyText}>
                            100% Land Vorarlberg{"\n"}{"\n"}
                        </Text>
                        <Text style={styles.privacyPolicyHeading}>
                            MITGLIEDER DES AUFSICHTSRATS{"\n"}
                        </Text>
                        <Text style={styles.privacyPolicyText}>
                            Landtagspräsident Mag. Harald Sonderegger - Vorsitzender,{"\n"}
                            Dr. Ernst Bitsche - Stv. Vorsitzender,{"\n"}
                            Dr. Bertram Batlogg,{"\n"}
                            Mag. Gabriela Dür,{"\n"}
                            MMag. Stefanie Fußenegger,{"\n"}
                            Dr. Christoph Jenny,{"\n"}
                            Dr. Ludwig Summer{"\n"}
                            Dr. Eva Häfele{"\n"}{"\n"}
                        </Text>
                        <Text style={styles.privacyPolicyHeading}>
                            VOM BETRIEBSRAT ENTSANDT{"\n"}
                        </Text>
                        <Text style={styles.privacyPolicyText}>
                            Dr. Markus Reichart,{"\n"}
                            Karin Wüstner-Dobler, MSc,{"\n"}
                            Betr.eoc. Ing. Werner Manahl,{"\n"}
                            Heidi Graninger{"\n"}{"\n"}
                        </Text>
                        <Text style={styles.privacyPolicyHeading}>
                            AUFSICHTSBEHÖRDE{"\n"}
                        </Text>
                        <Text style={styles.privacyPolicyText}>
                            Agentur für Qualitätssicherung und Akkreditierung Austria / Bundesministerium für
                            Wissenschaft und Forschung{"\n"}{"\n"}

                            Die Fachhochschule Vorarlberg GmbH ist Mitglied der Österreichischen
                            Fachhochschulkonferenz.{"\n"}{"\n"}
                        </Text>
                        <Text style={styles.privacyPolicyHeading}>
                            MOBILITY CHOICES PROJEKTPARTNER{"\n"}{"\n"}
                        </Text>
                        <Text style={styles.privacyPolicyText}>
                            Kairos - Institut für Wirkungsforschung und Entwicklung{"\n"}
                            Anton Walser Gasse 4{"\n"}
                            6900 Bregenz{"\n"}
                            info@kairos.or.at{"\n"}
                            ZVR: 231531818{"\n"}{"\n"}

                            FHS St. Gallen{"\n"}
                            Institut für Informations- und Prozessmanagement{"\n"}
                            Rosenbergstrasse{"\n"}
                            9001 St. Gallen{"\n"}{"\n"}
                        </Text>
                        <Text style={styles.privacyPolicyHeading}>
                            TÄTIGKEITSBEREICH UND INFORMATIONEN ZUM DATENSCHUTZ{"\n"}
                        </Text>
                        <Text style={styles.privacyPolicyText}>
                            Die Mobility Choices App stellt Funktionen zur Verfügung, um Routen für die Benutzer der
                            App,
                            je nach Präferenzen, zu optimieren. Dabei müssen für die Registrierung in der App Daten wie
                            E-Mail-Adresse, Passwort, das Alter, das Geschlecht und der Heimatort angegeben werden.
                            Um die Routen für den Benutzer optimieren zu können, müssen die Wege aufgezeichnet werden,
                            d.h. GPS-Daten des Benutzers werden abgespeichert. Alle gespeicherten Daten werden
                            ausschließlich
                            für interne Zwecke verwendet.{"\n"}{"\n"}

                            Für Forschungszwecke werden die Daten an Dritte weitergegeben. Zuvor werden diese jedoch
                            anonymisiert.
                            Sie können also nicht mehr auf die Person, von der sie stammen, zurückgeführt werden.

                        </Text>
                    </ScrollView>
                </Content>
            </Container>
        );
    }
}

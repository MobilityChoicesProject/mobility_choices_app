import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {styles} from '../../Styles/GlobalStyles';

export default class PrivacyPolicyComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View>
                <Text style={styles.privacyPolicyText}>
                    Die Nutzungsbedingungen und die Datenschutzerklärung stellen die vertragliche
                    Vereinbarung zwischen den NutzerInnen und dem Anbieter dar.{"\n"}{"\n"}

                    Der korrekte und sorgfältige Umgang mit Ihren Daten hat einen besonders hohen
                    Stellenwert.
                    Deshalb halten wir uns bei der Verarbeitung von Daten
                    an die nationalen sowie an die europäischen Datenschutzbestimmungen.{"\n"}{"\n"}
                </Text>
                <Text style={styles.privacyPolicyHeading}>
                    1. ZWECK DER ERHEBUNG{"\n"}
                </Text>
                <Text style={styles.privacyPolicyText}>
                    Die Nutzerdaten, die in der App gesammelt und gespeichert werden, werden für
                    folgende Zwecke
                    verwendet:{"\n"}
                    • zur Optimierung der Routen, je nach Präferenzen des Benutzers{"\n"}
                    • um das Fahrzeug, mit dem sich der Benutzer fortbewegt, zu erkennen{"\n"}
                    • um die Verkehrsplanung für die nächsten Jahre zu verbessern, indem
                    die Wegdaten anonymisiert an Dritte weitergegeben werden. Von Nutzern,
                    die sich einer Nutzergruppe durch Anwählen im Bereich „Profil“ selbst zuordnen,
                    werden ausschließlich die Anzahl der Wege weitergegeben, keinesfalls die Wegdaten
                    selbst.{"\n"}{"\n"}
                </Text>
                <Text style={styles.privacyPolicyHeading}>
                    2. REGISTRIERUNG{"\n"}
                </Text>
                <Text style={styles.privacyPolicyText}>
                    Um die App verwenden zu können, müssen Sie sich zuvor registrieren.
                    Dazu müssen Sie die Nutzungsbedingungen und die Datenschutzinformation bestätigen,
                    ansonsten können Sie sich nicht registrieren und die Funktionen der App nicht benutzen.
                    Zusätzlich müssen Sie für die Registrierung eine E-Mail-Adresse, ein Passwort, das
                    Geschlecht, das Alter sowie das Heimatland angeben. Die E-Mail-Adresse muss von Ihnen über
                    Ihren E-Mail-Account bestätigt werden und wird im Falle eines Passwortverlustes benutzt,
                    um Ihnen ein neues Passwort zuzusenden. Ihre eingegebenen Daten werden in unserer Datenbank
                    gespeichert und werden ausschließlich intern verwendet und verarbeitet. Rechtsgrundlage für die
                    Datenverarbeitungen in dieser App ist die vertragliche Vereinbarung bzw. Ihre Einwilligung
                    (Art. 6 Abs 1 lit. a) und b). Mit der Registrierung stimmen Sie den Nutzungsbestimmungen und
                    Datenverarbeitungen dieser App zu. Diese Einwilligung können Sie jederzeit widerrufen, allerdings
                    können Sie dann die Funktionen der App nicht mehr nutzen. Voraussetzung für die Registrierung und
                    Nutzung der App ist, dass Sie mindestens 16 Jahre alt sind.{"\n"}{"\n"}
                </Text>
                <Text style={styles.privacyPolicyHeading}>
                    3. WEITERGABE DER ANONYMISIERTEN GETRACKTEN GPS-DATEN AN DRITTE{"\n"}
                </Text>
                <Text style={styles.privacyPolicyText}>
                    Die App ermöglicht es, die GPS-Daten von einem Startpunkt zum gewünschten Zielort zu tracken. Diese
                    Daten werden in unserem System abgespeichert. Ein Ziel dieser App ist es, den Alltagsverkehr in der
                    Projektregion zu verbessern. Dazu soll es Dritten (Gemeinden, Regionen, Organisationen) möglich
                    sein,
                    das Verkehrsverhalten einer ausgewählten Gruppe von Menschen in bestimmten Teilbereichen
                    (Straßenabschnitten,
                    Regionen, Gemeinden etc) zu beobachten. Für diesen Zweck können eigene Nutzergruppen gebildet
                    werden, zu denen
                    alle Nutzer freiwillig beitreten können. Sobald ein Nutzer einer solche Gruppe beitritt, werden
                    neben den
                    anonymisierten Wegedaten auch E-Mail-Adresse und Anzahl der Wege aller teilnehmenden Nutzer dieser
                    Gruppe Dritten
                    verfügbar gemacht. So soll es möglich sein, Nutzer für deren Beteiligung am Projekt speziell
                    wertzuschätzen, dies
                    erfolgt ausschließlich über die E-Mail-Adresse. Es wird empfohlen, eine E-Mail-Adresse ohne
                    Personenbezug zu verwenden.
                    Sofern sich aus der E-Mail-Adresse kein Personenbezug ableiten lässt, kann diese Datenweitergabe
                    somit anonymisiert erfolgen.
                    Zu Zwecken der Verbesserung der Verkehrsplanung und zu Forschungszwecken werden die gespeicherten
                    Routen der Benutzer
                    anonymisiert (d.h. es kann nicht nachvollzogen werden, von welcher Person eine spezifische Route
                    stammt) und an Dritte zu
                    Forschungszwecken zur Verbesserung der Verkehrsplanung weitergegeben. Über die oben angeführten
                    Datenweitergaben hinaus
                    erfolgt keine Weitergabe der personenbezogenen Daten an Dritte.{"\n"}{"\n"}
                </Text>
                <Text style={styles.privacyPolicyHeading}>
                    4. VERWENDUNG DER GOOGLE MAPS SCHNITTSTELLE{"\n"}
                </Text>
                <Text style={styles.privacyPolicyText}>
                    In unserer App werden Google Places sowie Google Geocoding der Google Maps Schnittstelle verwendet.
                    Durch die Benutzung
                    der App und die Einwilligung in unsere Datenschutzerklärung sind Sie an die Nutzungsbedingungen von
                    Google gebunden.
                    Durch die Nutzung dieser App erklären Sie Ihr Einverständnis für die Bearbeitung der über Sie
                    erhobenen Daten durch
                    Google Places sowie, Google Geocoding der Google Maps Schnittstelle.{"\n"}{"\n"}
                </Text>
                <Text style={styles.privacyPolicyHeading}>
                    5. URHEBERRECHT{"\n"}
                </Text>
                <Text style={styles.privacyPolicyText}>
                    Die Rechte für die App liegen bei der Fachhochschule Vorarlberg GmbH. Sie sind berechtigt, diese App
                    für private
                    Zwecke kostenlos zu nutzen. {"\n"}{"\n"}
                </Text>
                <Text style={styles.privacyPolicyHeading}>
                    6. HAFTUNG{"\n"}
                </Text>
                <Text style={styles.privacyPolicyText}>
                    Obwohl wir mit größter Sorgfalt arbeiten, kann hinsichtlich der Richtigkeit, Genauigkeit,
                    Zuverlässigkeit und
                    Vollständigkeit der Informationen keine Gewährleistung oder Haftung übernommen werden.
                    Haftungsansprüche gegenüber
                    der Fachhochschule Vorarlberg GmbH wegen Schäden materieller oder immaterieller Art, welche aus der
                    Nutzung der App,
                    durch deren Missbrauch (auch durch Dritte) oder durch technische Fehler entstanden sind, werden
                    ausgeschlossen,
                    insofern diese nicht vorsätzlich oder grob fahrlässig verursacht wurden. Dies gilt jedoch nicht für
                    die Haftung
                    für Personenschäden.{"\n"}{"\n"}
                </Text>
                <Text style={styles.privacyPolicyHeading}>
                    7. IHRE BETROFFENEN-RECHTE GEMÄSS DER DSGVO{"\n"}
                </Text>
                <Text style={styles.privacyPolicyText}>
                    Ihnen stehen grundsätzlich die Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung,
                    Datenübertragbarkeit
                    und Widerspruch zu. Dafür wenden Sie sich an datenschutz@fhv.at. Wenn Sie glauben, dass die
                    Verarbeitung Ihrer
                    Daten gegen das Datenschutzrecht verstößt oder Ihre datenschutzrechtlichen Ansprüche sonst in einer
                    Weise verletzt
                    worden sind, können Sie sich bei der Datenschutzbehörde beschweren.{"\n"}{"\n"}
                </Text>
                <Text style={styles.privacyPolicyHeading}>
                    8. KONTAKT{"\n"}
                </Text>
                <Text style={styles.privacyPolicyTextBold}>
                    Thomas Feilhauer{"\n"}
                </Text>
                <Text style={styles.privacyPolicyText}>
                    Mobility.choices@fhv.at{"\n"}{"\n"}
                    Für die Datenverarbeitung verantwortlich:{"\n"}
                </Text>
                <Text style={styles.privacyPolicyTextBold}>
                    Research Centre for Process- and Product-Engineering{"\n"}
                    FH VORARLBERG{"\n"}
                </Text>
                <Text style={styles.privacyPolicyText}>
                    University of Applied Sciences{"\n"}
                    Hochschulstraße 1{"\n"}
                    6850 Dornbirn, Austria{"\n"}{"\n"}

                    Kontakt Datenschutzbeauftragte/r:{"\n"}
                    datenschutz@fhv.at{"\n"}{"\n"}{"\n"}


                    05.06.2018{"\n"}{"\n"}
                </Text>
            </View>
        )
    }
}
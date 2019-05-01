import React, {Component} from 'react';
import {View} from 'react-native';
import MapView from 'react-native-maps';

import {styles} from '../../../Styles/GlobalStyles';

export default class MapComponentRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coordinates: this.props.track
        };
    }

    render() {
        var i;
        for (i = 0; i < this.state.coordinates.sections.length; i++) {
            var section = this.state.coordinates.sections[i];
            if (section.key == null) {
                section.key = i;
            }
            console.log(section.coordinates);
            if (section.points == null) {
                section.points = [];
            }
        }

        const sections = this.state.coordinates.sections.map((item) => {
            return (
                <MapView.Polyline
                    coordinates={item.points}
                    key={item.key}
                    strokeColor='#ff081f'
                    strokeWidth={2}
                />
            )
        });
        const markers = this.state.coordinates.sections.map((item) => {
            return (
                <MapView.Marker
                    coordinate={{
                        latitude: item.to.lat,
                        longitude: item.to.lng
                    }}
                    title={item.to.name}
                    key={item.key}
                />
            )
        });

        return (
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: this.state.coordinates.sections[0].from.lat,
                        longitude: this.state.coordinates.sections[0].from.lng,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {sections}
                    {markers}
                </MapView>
            </View>
        )
    }
}

import React, {Component} from 'react';
import {View} from 'react-native';
import Helper from '../../../Lib/HelperAPI';
import MapView from 'react-native-maps';

import {styles} from '../../../Styles/GlobalStyles';

export default class MapComponentTmd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            track: this.props.track,
            lines: []
        };
    }

    async componentWillMount() {
        var lines = [];

        for (var index in this.state.track.sections) {
            var section = this.state.track.sections[index];
            var line = [];

            for (var i in section.coordinates) {
                var coordinate = section.coordinates[i];

                var latLng = {
                    latitude: coordinate.lat,
                    longitude: coordinate.lng
                };

                line.push(latLng);
            }

            line.start = section.start;
            line.key = index;
            line.color = Helper.getPolylineColorForType(section);
            line.isStationary = section.transportMode === 'STATIONARY';

            await lines.push(line);
        }

        this.setState({lines: lines});
    }

    render() {
        const sections = this.state.lines.map((item) => {
            if (!item.isStationary) {
                return (
                    <MapView.Polyline
                        coordinates={item}
                        key={item.key}
                        strokeColor={item.color}
                        strokeWidth={2}
                    />
                )
            }
        });

        const markers = this.state.lines.map((item) => {
            console.log(item);
            if (item.isStationary) {
                return (
                    <MapView.Marker
                        coordinate={{
                            latitude: item.start.coordinates.lat,
                            longitude: item.start.coordinates.lng
                        }}
                        title={item.start.name}
                        key={item.key}
                    />
                )
            }
        });

        return (
            <View style={styles.container}>
                <MapView
                    style={styles.bigMap}
                    initialRegion={{
                        latitude: this.state.track.sections[0].coordinates[0].lat,
                        longitude: this.state.track.sections[0].coordinates[0].lng,
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

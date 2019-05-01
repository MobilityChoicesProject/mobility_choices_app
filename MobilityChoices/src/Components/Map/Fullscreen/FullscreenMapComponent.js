import React, {Component} from 'react';
import {View} from 'react-native';
import MapView from 'react-native-maps';

import {styles} from '../../../Styles/GlobalStyles';

export default class MapComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coordinates: this.props.track
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView
                    style={styles.bigMap}
                    initialRegion={{
                        latitude: this.state.coordinates[0].latitude,
                        longitude: this.state.coordinates[0].longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    <MapView.Polyline strokeColor={'#ff081f'}
                                      coordinates={this.state.coordinates}
                    />
                </MapView>
            </View>
        )
    }
}

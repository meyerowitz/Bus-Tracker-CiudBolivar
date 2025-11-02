import { AppleMaps, GoogleMaps } from 'expo-maps';
import { Platform, Text } from 'react-native';

export default function Maps() {
    return(
        <GoogleMaps.View style={{ flex: 1 }} />
    );

}
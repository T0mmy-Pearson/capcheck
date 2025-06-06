import MapView, { Marker, MapPressEvent, Region, Geojson, UrlTile } from "react-native-maps";
import { useState, useEffect } from "react";
import { StyleSheet, View, Alert, Text } from "react-native";
import * as Location from "expo-location"


export default function MapScreen() {
  const [region, setRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null)
  const [marker, setMarker] = useState<{ latitude: number; longitude: number; } | null>(null)

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      console.log("Permission status:", status)
      if (status !== "granted") {
        Alert.alert("access denied")
        return;
      }
      let location = await Location.getCurrentPositionAsync({})
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      })
    })()
  }, [])

  const handleMapPress = (event: MapPressEvent) => {
    const { coordinate } = event.nativeEvent
    setMarker(coordinate)
  }

  if (!region) {
    return (
      <View style={styles.loading}>
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <MapView
      provider="google"
      zoomControlEnabled={true}
      style={styles.map}
      region={region}
      onPress={handleMapPress}
      showsUserLocation>
      {marker && (
        <Marker coordinate={marker}
          title="custom marker"
          description="tapped here" />
      )}
      <UrlTile
  
    urlTemplate="https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=cede26dda2a03494927af0171d3c0b2a"
    zIndex={1}
    maximumZ={19}
    flipY={false}
  />
    </MapView>
  )
}

const styles = StyleSheet.create({
  map: { 
    flex: 1, 
    width: "100%", 
      height: "100%"
   },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});
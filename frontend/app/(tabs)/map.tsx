import MapView, { Marker, MapPressEvent, Region, Geojson, UrlTile } from "react-native-maps";
import { useState, useEffect } from "react";
import { StyleSheet, View, Alert, Text, Switch } from "react-native"; // <-- import Switch
import * as Location from "expo-location"
import { HelloWave } from "@/components/WaveText";

export default function MapScreen() {
  const [region, setRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null)
  const [marker, setMarker] = useState<{ latitude: number; longitude: number; } | null>(null)
  const [showRain, setShowRain] = useState(true); // <-- add toggle state

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
    <View style={{ flex: 1 }}>
      <View style={styles.toggleContainer}>
        <Text>Show Rainfall</Text>
        <Switch
          value={showRain}
          onValueChange={setShowRain}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={showRain ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3f"
        />
      </View>
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
        {showRain && (
          <UrlTile
            urlTemplate="https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=cede26dda2a03494927af0171d3c0b2a"
            zIndex={1}
            maximumZ={19}
            flipY={false}
          />
        )}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    bottom: 100,
    left: 200,
    backgroundColor: "#fff",
    gap: 10,
    position: "absolute",
    zIndex: 100,
  },
});
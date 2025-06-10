// import MapView, { Marker, MapPressEvent, Region, Geojson, UrlTile } from "react-native-maps";
// import { useState, useEffect } from "react";
// import { StyleSheet, View, Alert, Text, Switch, Button } from "react-native";
// import * as Location from "expo-location"



// export default function MapScreen() {
//   const [region, setRegion] = useState<{
//     latitude: number;
//     longitude: number;
//     latitudeDelta: number;
//     longitudeDelta: number;
//   } | null>(null)
//   const [marker, setMarker] = useState<{ latitude: number; longitude: number; } | null>(null)
//   const [showRain, setShowRain] = useState(true);
//   const [pending, setPending] = useState(false);

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync()
//       console.log("Permission status:", status)
//       if (status !== "granted") {
//         Alert.alert("access denied")
//         return;
//       }
//       let location = await Location.getCurrentPositionAsync({})
//       setRegion({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//         latitudeDelta: 20.9,
//         longitudeDelta: 20.9
//       })
//     })()
//   }, [])

//  const onToggle = (val: boolean) => {
//     if (pending) return;
//     setPending(true);
//     setShowRain(val);
//     // give tiles a moment to unload before next toggle
//     setTimeout(() => setPending(false), 500);
//   };



//   const handleMapPress = (event: MapPressEvent) => {
//     const { coordinate } = event.nativeEvent
//     setMarker(coordinate)
//   }

//   if (!region) {
//     return (
//       <View style={styles.loading}>
//         <Text>Loading map...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1 }}>
//       <View style={styles.toggleContainer}>
//         <Button
//           color={showRain ? "black" : "gray"}
//           title={showRain ? 'Show Rain' : 'Show Rain'}
//           onPress={() => setShowRain(prev => !prev)}
//         />
//       </View>
//       <MapView
//         provider="google"
//         zoomControlEnabled={true}
//         style={styles.map}
//         region={region}
//         onPress={handleMapPress}
//         showsUserLocation>
//         {marker && (
//           <Marker coordinate={marker}
//             title="custom marker"
//             description="tapped here" />
//         )}
//         {showRain && (
//           <UrlTile
//             key={String(showRain)}
//             urlTemplate={"https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=cede26dda2a03494927af0171d3c0b2a"}
//             zIndex={1}
//             maximumZ={19}
//             flipY={false}
//             opacity={1}
//           />
//        )}
//         {showRain && (
//           <UrlTile
//             urlTemplate={"https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=cede26dda2a03494927af0171d3c0b2a"}
//             zIndex={1}
//             maximumZ={19}
//             flipY={false}
//             opacity={1}
//           />
//        )}
//        {showRain && (
//           <UrlTile
//             urlTemplate={"https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=cede26dda2a03494927af0171d3c0b2a"}
//             zIndex={1}
//             maximumZ={19}
//             flipY={false}
//             opacity={1}
//           />
//        )}
//        {showRain && (
//           <UrlTile
//             urlTemplate={"https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=cede26dda2a03494927af0171d3c0b2a"}
//             zIndex={1}
//             maximumZ={19}
//             flipY={false}
//             opacity={1}
//           />
//        )}
//       </MapView>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   map: {
//     flex: 1,
//     width: "100%",
//     height: "100%"
//   },
//   loading: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center"
//   },
//   toggleContainer: {
//     flexDirection: "row",
//     color: "#000",
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: 33,
//     padding: 10,
//     bottom: 100,
//     left: 250,
//     backgroundColor: "#fff",
//     gap: 10,
//     position: "absolute",
//     zIndex: 100,
//   },
// });
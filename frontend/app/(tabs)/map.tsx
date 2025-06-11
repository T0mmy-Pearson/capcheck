
import MapView, { Marker, MapPressEvent, UrlTile } from "react-native-maps";
import { useState, useEffect } from "react";
import { StyleSheet, View, Alert, Text, Button, TextInput, FlatList, TouchableOpacity } from "react-native";
import * as Location from "expo-location"
import { fetchMushroomMarkerLocations, fetchMushrooms } from "@/utils/api";
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator } from "react-native";

interface Mushroom {
  id: number;
  name: string;
  mushroomId?: number;
}

interface MarkerType {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
}



export default function MapScreen() {
  const [region, setRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null)
  const [marker, setMarker] = useState<{ latitude: number; longitude: number; } | null>(null)
  const [showRain, setShowRain] = useState(true);
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredMarkers, setFilteredMarkers] = useState<MarkerType[]>([]);
  const [selectedMushroomId, setSelectedMushroomId] = useState<number | null>(null);
  const [allMushrooms, setAllMushrooms] = useState<Mushroom[]>([]);
  const [deviceLocation, setDeviceLocation] = useState<{ latitude: number; longitude: number; } | null>(null);
  const [loadingMushrooms, setLoadingMushrooms] = useState(true);
  const [loadingMarkers, setLoadingMarkers] = useState(true);
  const [pendingMushroom, setPendingMushroom] = useState<Mushroom | null>(null);


  /* Permissions */


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("access denied")
        return;
      }
      let location = await Location.getCurrentPositionAsync({})
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 5,
        longitudeDelta: 5
      });
      setDeviceLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      })
    })()
  }, [])


  useEffect(() => {
    setLoadingMushrooms(true);
    fetch("https://capcheck.onrender.com/api/mushroom/")
      .then((res) => res.json())
      .then((data) => {
        setAllMushrooms(data.mushrooms);
      })
      .finally(() => {
        setLoadingMushrooms(false);
      });
  }, []);


  const filteredSuggestions = search.length === 0
    ? []
    : allMushrooms.filter(m =>
      (m.name || "Mushroom").toLowerCase().includes(search.toLowerCase())
    );



  // Fetch and transform markers ON SEARCH, could be random number 1-257??
  useEffect(() => {
    if (selectedMushroomId !== null) {
      setLoadingMarkers(true)
      const selectedMushroom = allMushrooms.find(m => m.id === selectedMushroomId);
      fetchMushroomMarkerLocations(selectedMushroomId)
        .then((data) => {

          const limited = data.slice(0, 50);
          const markers = limited.map((arr, idx) => ({
            id: idx,
            latitude: arr[0],
            longitude: arr[1],
            name: selectedMushroom /* ? selectedMushroom.name : `Mushroom ${selectedMushroomId}` */
          }));
          setFilteredMarkers(markers);
        })
        .catch((err) => {
          console.error("Failed to fetch mushroom markers", err);
        })
        .finally(() => {
          setLoadingMarkers(false);
        });
    } else {
      setFilteredMarkers([]);
    }
  }, [selectedMushroomId]);

  return (
    <>
      <View style={styles.searchBarContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            style={[styles.searchBar, { flex: 1 }]}
            placeholder="Look for a mushroom...!"
            value={search}
            onChangeText={text => {
              setSearch(text);
              setShowSuggestions(true);
              setPendingMushroom(null);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
          />
          <TouchableOpacity
            style={{ marginLeft: 8, padding: 8 }}
            onPress={() => {
              if (pendingMushroom) {
                setSelectedMushroomId(pendingMushroom.id);
                setShowSuggestions(false);
              }
            }}
            disabled={!pendingMushroom}
          >
            <Ionicons name="search" size={24} color={pendingMushroom ? "#333" : "#ffffff"} />
          </TouchableOpacity>
        </View>
         {loadingMushrooms && (
          <View style={{ padding: 10, alignItems: "center" }}>
            <ActivityIndicator size="small" color="#333" />
            <Text>Loading mushrooms...</Text>
          </View>
        )}
        {showSuggestions && !loadingMushrooms && search.length > 0 && filteredSuggestions.length > 0 && (
          <FlatList
            style={styles.suggestions}
            data={filteredSuggestions}
            keyExtractor={item => (item.id ? item.id.toString() : Math.random().toString())}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSearch(item.name || "Mushroom");
                  setShowSuggestions(false);
                  setPendingMushroom(item);
                  setSelectedMushroomId(item.mushroomId);
                }}
              >
                <Text style={styles.suggestionItem}>{item.name || "Mushroom"}</Text>
              </TouchableOpacity>
            )}
          />
        )}
        

        {filteredMarkers.map((m) => (
          <Marker
            key={m.id}
            coordinate={{ latitude: m.latitude, longitude: m.longitude }}
            title={m.name || "Mushroom"}
            image={require("../../assets/images/icon-1.png")}
          />
        ))}
        {/* <View style={{ position: "absolute", bottom: 40, right: 30, zIndex: 300 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "transparent",
              borderRadius: 25,
              padding: 12,
              elevation: 4,
              alignItems: "center",
              justifyContent: "center"
            }}
            onPress={() => {
              if (deviceLocation) {
                setRegion(region => region && ({
                  ...region,
                  latitude: deviceLocation.latitude,
                  longitude: deviceLocation.longitude,
                }));
              }
            }}
          >
            <Ionicons name="locate" size={28} color="#333" />
          </TouchableOpacity>
        </View> */}
      </View>


      {/* UrlTile OVerlay */}
      <View style={{ flex: 1 }}>
        <View style={styles.toggleContainer}>
          <Button
            color={showRain ? "black" : "gray"}
            title={showRain ? 'Show Rain' : 'Show Rain'}
            onPress={() => setShowRain(prev => !prev)}
          />
        </View>
        <MapView
          provider="google"
          zoomControlEnabled={true}
          style={styles.map}
          region={region}
          showsUserLocation>
          {filteredMarkers.map((m) => (
            <Marker
              key={m.id}
              style={styles.markerImg}
              coordinate={{ latitude: m.latitude, longitude: m.longitude }}
              title={m.name || "Mushroom"}
              image={require("../../assets/images/icon-1.png")}
            />
          ))}
        {!loadingMarkers && filteredMarkers.map((m) => (
          <Marker
            key={m.id}
            coordinate={{ latitude: m.latitude, longitude: m.longitude }}
            title={m.name || "Mushroom"}
            image={require("../../assets/images/icon-1.png")}
          />
        ))}
          {showRain && (
            <UrlTile
              urlTemplate={"https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=cede26dda2a03494927af0171d3c0b2a"}
              zIndex={1}
              maximumZ={19}
              flipY={false}
              opacity={1}
            />
          )}
          {showRain && (
            <UrlTile
              urlTemplate={"https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=cede26dda2a03494927af0171d3c0b2a"}
              zIndex={1}
              maximumZ={19}
              flipY={false}
              opacity={1}
            />
          )}
          {showRain && (
            <UrlTile
              urlTemplate={"https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=cede26dda2a03494927af0171d3c0b2a"}
              zIndex={1}
              maximumZ={19}
              flipY={false}
              opacity={1}
            />
          )}
          {showRain && (
            <UrlTile
              urlTemplate={"https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=cede26dda2a03494927af0171d3c0b2a"}
              zIndex={1}
              maximumZ={19}
              flipY={false}
              opacity={1}
            />
          )}
        </MapView>
      </View>
    </>
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
    color: "#000",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 33,
    padding: 10,
    bottom: 100,
    left: 250,
    backgroundColor: "#fff",
    gap: 10,
    position: "absolute",
    zIndex: 100,
  },
  searchBarContainer: {
    position: "absolute",
    color: "#000",
    top: 50,
    left: 20,
    right: 20,
    zIndex: 200,

  },
  searchBar: {
    backgroundColor: "#fff",
    color: "#000000",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    elevation: 2,
    shadowColor: "#000",
  },
  suggestions: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 2,
    maxHeight: 120,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});


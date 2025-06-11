
import MapView, { Marker, Callout, UrlTile } from "react-native-maps";
import { useState, useEffect } from "react";
import { StyleSheet, View, Alert, Text, Button, TextInput, FlatList, TouchableOpacity, Pressable } from "react-native";
import * as Location from "expo-location"
import { fetchMushroomMarkerLocations, fetchMushrooms } from "@/utils/api";
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";


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

  const navigation = useNavigation<any>();


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

        setAllMushrooms(
          data.mushrooms.map((m: any) => ({
            id: m.mushroomId ?? m.id,
            name: m.name,
          }))
        );
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

          const limited = data.slice(0, 200);
          const markers = limited.map((arr, idx) => ({
            id: idx,
            latitude: arr[0],
            longitude: arr[1],
            name: selectedMushroom ? selectedMushroom.name : `Mushroom ${selectedMushroomId}`
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
      {/* SearchBar */}
      <View style={styles.searchBarContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
          <TextInput
            style={[styles.searchBar, { flex: 1, paddingRight: 70 }]}
            placeholder="search for a mushroom..."
            placeholderTextColor="#777"
            value={search}
            onChangeText={text => {
              setSearch(text);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
          />
          {/* CLEAR SEARCH BAR */}
          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearch('');
                setShowSuggestions(false);
                setSelectedMushroomId(null);
              }}
              style={{
                position: 'absolute',
                right: 40,
                top: 0,
                bottom: 0,
                justifyContent: 'center',
                padding: 8,
              }}
              accessibilityLabel="Clear search"
            >
              <Ionicons name="close" size={22} color="#888" />
            </TouchableOpacity>
          )}
          {/* SEARCH BUTTON */}
          <TouchableOpacity
            onPress={() => {

              const found = allMushrooms.find(m => m.name.toLowerCase() === search.toLowerCase());
              if (found) {
                setSelectedMushroomId(found.id);
                setShowSuggestions(false);
                setSearch('');

              }
              setShowSuggestions(false);
            }}
            style={{
              position: 'absolute',
              right: 4,
              top: 0,
              bottom: 0,
              justifyContent: 'center',
              padding: 8,
            }}
          >
            <Ionicons name="search" size={24} color={search ? "#333" : "#ccc"} />
          </TouchableOpacity>
        </View>
        {loadingMushrooms && (
          <View style={{ padding: 10, alignItems: "center" }}>
            <ActivityIndicator size="small" color="#333" />
            <Text>Loading mushrooms...</Text>
          </View>
        )}

        {/* Dropdown List items */}
        {showSuggestions && !loadingMushrooms && search.length > 0 && filteredSuggestions.length > 0 && (
          <FlatList
            style={styles.suggestions}
            data={filteredSuggestions}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable
                hitSlop={{ top: 10, bottom: 10, left: 40, right: 40 }}
                style={{
                  paddingVertical: 24,
                  paddingHorizontal: 32,
                  marginVertical: 4,
                  borderRadius: 10,
                  backgroundColor: "#fffde9",
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}
                onPress={() => {
                  setShowSuggestions(false);
                  setSearch(item.name);
                  setSelectedMushroomId(item.id);
                }}
              >
                <Text style={styles.suggestionItem}>{item.name || "Mushroom"}</Text>
              </Pressable>
            )}
          />
        )}
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
            >
              <Callout
                onPress={() => navigation.navigate("MushroomProfile", { mushroomName: m.name })}
                style={{ padding: 8, maxWidth: 200 }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>{m.name || "Mushroom"}</Text>
                <Text style={{ color: "#000000", marginTop: 4 }}>View Profile</Text>
              </Callout>
            </Marker>
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
    color: "#000000",
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
    backgroundColor: "#fefde9",
    width: "100%",
    borderRadius: 10,
    marginTop: 2,
    maxHeight: 250,
  },
  suggestionItem: {
    paddingVertical: 4,
    borderBottomWidth: 2,
    borderBottomColor: "#eee",
    fontSize: 24,
    backgroundColor: "#fffde9",

  },
});


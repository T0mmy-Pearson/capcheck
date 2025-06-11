
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
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [selectedMushroomId, setSelectedMushroomId] = useState<number | null>(null);
  const [allMushrooms, setAllMushrooms] = useState([]);
  const [deviceLocation, setDeviceLocation] = useState<{ latitude: number; longitude: number; } | null>(null);




  // Fetch and transform markers ON LOADING, could be random number 1-257
 useEffect(() => {
  if (selectedMushroomId !== null) {
    const selectedMushroom = allMushrooms.find(m => m.id === selectedMushroomId);
    fetchMushroomMarkerLocations(selectedMushroomId)
      .then((data) => {

        const limited = data.slice(0, 50);
        const markers = limited.map((arr, idx) => ({
          id: idx,
          latitude: arr[0],
          longitude: arr[1],
 name: selectedMushroom ? selectedMushroom.name : `Mushroom ${selectedMushroomId}`
        }));
        setFilteredMarkers(markers);
        console.log("Markers set:", markers);
      })
      .catch((err) => {
        console.error("Failed to fetch mushroom markers", err);
      });
  } else {
    setFilteredMarkers([]); 
  }
}, [selectedMushroomId]);

  // Filter markers AFTER search
/*   useEffect(() => {
    if (search.length === 0) {
      setFilteredMarkers(mushroomMarkers);

    } else {
      setFilteredMarkers(
        mushroomMarkers.filter((m) =>
          (m.name || "Mushroom").toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, mushroomMarkers]); */



  return (
    <>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Look for a mushroom...!"
          value={search}
          onChangeText={text => {
            setSearch(text);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        />
        {showSuggestions && search.length > 0 && filteredSuggestions.length > 0 && (
          <FlatList
            style={styles.suggestions}
            data={filteredSuggestions}
keyExtractor={item => (item.id ? item.id.toString() : Math.random().toString())}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSearch(item.name || "Mushroom");
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
   <View style={{ position: "absolute", bottom: 40, right: 30, zIndex: 300 }}>
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
      </View>
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

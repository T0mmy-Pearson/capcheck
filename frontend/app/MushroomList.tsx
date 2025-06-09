import React, { useEffect, useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  Pressable,
} from "react-native";
import { BodyText } from "@/components/BodyText";
import { useNavigation } from "@react-navigation/native";
import fixImgUrl from "@/utils/fixImgUrl";
import formatSeasonValue from "@/utils/formatSeasonValue";
import edibleIcon from "@/utils/edibleIcons";
import SearchBar from "@/components/SearchBar";

const FILTERS = ["All", "Edible", "Inedible", "Poisonous"];

export default function MushroomList() {
  const [mushrooms, setMushrooms] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const navigation = useNavigation<any>();

  useEffect(() => {
    fetch("https://capcheck.onrender.com/api/mushroom/")
      .then((res) => res.json())
      .then((data) => setMushrooms(data.mushrooms));
  }, []);

  const filteredMushrooms = mushrooms.filter((item: any) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "All" ? true : item.edible === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.container}>
      <Text style={{ color: "white", fontSize: 36, paddingBottom: 20, paddingLeft: 10 }}>←</Text>
      {/* Search Bar */}
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search mushrooms..."
        style={styles.searchBar}
      />
      {/* Filter Bar */}
      <View style={styles.filterBar}>
        {FILTERS.map((type) => (
          <Pressable
            key={type}
            style={[
              styles.filterButton,
              filter === type && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(type)}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === type && styles.filterButtonTextActive,
              ]}
            >
              {type}
            </Text>
          </Pressable>
        ))}
      </View>
      {/* Mushroom List */}
      <FlatList
        contentContainerStyle={{ paddingBottom: 20 }}
        data={filteredMushrooms}
        keyExtractor={(item) => item.mushroomId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("MushroomProfile", {
                mushroomId: item.mushroomId,
              })
            }
          >
            <View style={styles.item}>
              <View style={{ flex: 1 }}>
                <BodyText style={styles.name}>{item.name}</BodyText>
                <BodyText style={styles.scientificName}>{item.scientificName}</BodyText>
                <BodyText>{edibleIcon(item)}</BodyText>
                <BodyText style={styles.seasons}>
                  {formatSeasonValue(item.start)}
                  {item.start !== "All" && item.end !== "All"
                    ? `${item.start} until ${item.end}`
                    : "All Year Round"}
                </BodyText>
              </View>
              <Image
                source={{ uri: fixImgUrl(item.imgUrl) }}
                style={styles.image}
              />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  filterBar: {
    flexDirection: "row",
    justifyContent: "center",
    width: "90%",
    marginBottom: 8,
    marginTop: 8,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 50,
    backgroundColor: "#333",
  },
  filterButtonActive: {
    backgroundColor: "#cdff8f",
  },
  filterButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  filterButtonTextActive: {
    color: "#000000",
  },
  searchBar: {
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  name: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  scientificName: {
    color: "#000000",
    fontStyle: "italic",
    fontSize: 13,
    textAlign: "left",
  },
  seasons: {
    color: "#ffffff",
    fontSize: 15,
    marginBottom: 4,
    marginTop: 4,
  },
  item: {
    backgroundColor: "#4e5249",
    borderRadius: 33,
    padding: 10,
    marginHorizontal: 10,
    paddingLeft: 20,
    marginTop: 9,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    height: 130,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 30,
    marginLeft: 10,
    marginTop: 0,
  },
});
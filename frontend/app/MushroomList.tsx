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



export default function MushroomList() {
  const [mushrooms, setMushrooms] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState<string | null>(null);
  const navigation = useNavigation<any>();

  interface Mushroom {
  mushroomId: number;
  name: string;
  scientificName: string;
  imgUrl: string;
  start: string;
  end: string;
  edible: string;

}

  useEffect(() => {
    fetch("https://capcheck.onrender.com/api/mushroom/")
      .then((res) => res.json())
      .then((data) => setMushrooms(data.mushrooms));
  }, []);


  const FILTERS = ["All", "Edible", "Inedible", "Poisonous", "In Season"];
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().toLocaleString("default", { month: "short" });

  const filteredMushrooms = mushrooms.filter((item: any) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    let matchesFilter = true;

    if (monthFilter) {
      matchesFilter = isInSeason(item.start, item.end, monthFilter);
    } else if (filter === "In Season") {
      matchesFilter = isInSeason(item.start, item.end, currentMonth);
    } else if (filter !== "All") {
      matchesFilter = item.edible === filter;
    }

    return matchesSearch && matchesFilter;
  });


  function isInSeason(start: string, end: string, month: string) {
    if (start === "All" || end === "All") return true;
    const startIdx = MONTHS.indexOf(start);
    const endIdx = MONTHS.indexOf(end);
    const monthIdx = MONTHS.indexOf(month);

    if (startIdx === -1 || endIdx === -1 || monthIdx === -1) return false;

    if (startIdx <= endIdx) {

      return monthIdx >= startIdx && monthIdx <= endIdx;
    } else {

      return monthIdx >= startIdx || monthIdx <= endIdx;
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
                      <Text style={{ color: "white", fontSize: 36, paddingBottom: 20 }}>←</Text>
                    </TouchableOpacity>
      {/* Search Bar */}
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search mushrooms..."
        onBlur={() => {
    setFilter("All");
    setMonthFilter(null);
  }}
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
            onPress={() => {
              setFilter(type);
              setMonthFilter(null);
            }}
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
      {/* Filter by season Bar */}
      <View style={{ flexDirection: "row", marginBottom: 8, marginTop: 4, flexWrap: "wrap" }}>
        {MONTHS.map((m) => (
          <Pressable
            key={m}
            style={[
              styles.filterButton,
              monthFilter === m && styles.filterButtonActive,
            ]}
            onPress={() => {
              setMonthFilter(m);
              setFilter("All");
            }}
          >
            <Text style={[
              styles.filterButtonText,
              monthFilter === m && styles.filterButtonTextActive,
            ]}>
              {m}
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
                  {formatSeasonValue(item)}
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
    flexWrap: "wrap",
    width: "100%",
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

  name: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  scientificName: {
    color: "#cdff8f",
    fontStyle: "italic",
    fontSize: 13,
    textAlign: "left",
    paddingBottom: 10,
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
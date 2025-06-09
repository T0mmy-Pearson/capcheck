import React, { useEffect, useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  Text
} from "react-native";
import { BodyText } from "@/components/BodyText";
import { useNavigation } from "@react-navigation/native";
import fixImgUrl from "@/utils/fixImgUrl";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useRoute } from "@react-navigation/native";

export default function MushroomList() {
  const [mushrooms, setMushrooms] = useState([]);
  const navigation = useNavigation<any>();


  useEffect(() => {
    fetch("https://capcheck.onrender.com/api/mushroom/")
      .then((res) => res.json())
      .then((data) => setMushrooms(data.mushrooms));
  }, []);

  function edibleIcon(item: any) {
    if (!item.edible) return null;
    if (item.edible === "Edible") return <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="green" />;
    if (item.edible === "Inedible") return <Octicons name="no-entry" size={24} color="red" />;
    if (item.edible === "Poisonous") return <FontAwesome6 name="skull-crossbones" size={24} color="purple" />;
  }

  // if item.start/end === a string of 'all year', return 'all year'
  function formatSeasonValue(item: string) {
    if (item.start === "All" || item.end === "All") {
      return "All Year";
    }
  };3

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={{ color: "white", fontSize: "36", paddingBottom: "20", paddingLeft: 10, }}>←</Text>
      </TouchableOpacity>
      <FlatList
        contentContainerStyle={{ paddingBottom: 20, }}
        data={mushrooms}
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

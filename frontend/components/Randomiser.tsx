import { BodyText } from "@/components/BodyText";
import fixImgUrl from "@/utils/fixImgUrl";
import { FontAwesome6, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { JSX, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";

const Randomiser = (): JSX.Element => {
  const [randomNumber, setRandomNumber] = useState<number | null>(null);

  const [mushroom, setMushroom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateRandomNumber = (): number => {
    const min: number = 1;
    const max: number = 256;

    const number: number = Math.floor(Math.random() * (max - min + 1)) + min;
    setRandomNumber(number);
    return number;
  };

  useEffect(() => {
    generateRandomNumber();
  }, []);


  useEffect(() => {
    if (randomNumber === null) return;

    setLoading(true);
    setError(null);

    fetch(`https://capcheck.onrender.com/api/mushroom/${randomNumber}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setMushroom(data.mushroom);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching mushroom:", error);
        setError("Failed to load mushroom data");
        setLoading(false);
      });
  }, [randomNumber]);

  if (loading) {
    return (
      <View
        style={[
          styles.titleContainer,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#666" />
        <Text style={styles.text}>Loading mushroom...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.titleContainer}>
        <Text style={styles.text}>{error}</Text>
        <TouchableOpacity onPress={() => generateRandomNumber()}>
          <Text style={[styles.text, { textDecorationLine: "underline" }]}>
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!mushroom) {
    return (
      <View style={styles.titleContainer}>
        <Text style={styles.text}>No mushroom data available</Text>
      </View>
    );
  }

  const correctedImgUrl = fixImgUrl(mushroom.imgUrl);

  function edibleIcon() {
    if (!mushroom.edible) return null;
    if (mushroom.edible === "Edible") return <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="green" />;
    if (mushroom.edible === "Inedible") return <Octicons name="no-entry" size={24} color="red" />;
    if (mushroom.edible === "Poisonous") return <FontAwesome6 name="skull-crossbones" size={24} color="purple" />;
  }

  return (
    <View style={styles.titleContainer}>
     <View style={styles.imageWrapper}>
  <Image source={{ uri: correctedImgUrl }} style={styles.image} />
</View>
      <View style={styles.nameBox}>
      <Text style={styles.title}>{mushroom.name}</Text>
      <BodyText style={styles.scientific}>{mushroom.scientificName}</BodyText>
    </View>
<View style={{flexDirection: "row", flexWrap: "wrap"}}>
<BodyText style={styles.text}>{mushroom.edible}</BodyText>
      <BodyText style={styles.text}>{edibleIcon()}</BodyText>
      <BodyText style={styles.text}>
        {mushroom.start} - {mushroom.end}
      </BodyText>

</View>
      {/* <BodyText style={styles.label}>Facts:</BodyText> */}
      <BodyText style={styles.text}>{mushroom.habitat}</BodyText>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    borderWidth: 2,
    borderRadius: 10,
    width: "100%", 
    maxWidth: 400, 
    alignSelf: "center",
    alignItems: "center",
    borderColor: "white",
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#000", gap: 10 },
  scientific: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#666",
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 1,
    resizeMode: "cover", 
  },
    label: {
      fontWeight: "bold",
      marginTop: 2,
      paddingBottom: 10,
      color: "#000",
    },
    text: { fontSize: 16, marginTop: 2, paddingBottom: 10, marginLeft: 5, marginRight: 5, color: "#000" },
    nameBox: {
    backgroundColor: "#ffffff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, 
},
imageWrapper: {
 width: "100%",
  aspectRatio: 2, 
  borderRadius: 10,
  marginVertical: 15,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.8,
  shadowRadius: 20,
  elevation: 5, 
  backgroundColor: "#fff",
  alignSelf: "center",
  overflow: "hidden",
},
});

export default Randomiser;

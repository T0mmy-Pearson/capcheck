import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Mushroom = {
  name: string;
  image: string;
};

export default function FoundMushrooms() {
  const [mushrooms, setMushrooms] = useState<Mushroom[]>([]);

  useEffect(() => {
    const loadMushrooms = async () => {
      const data = await AsyncStorage.getItem("foundMushrooms");
      if (data) setMushrooms(JSON.parse(data));
    };
    loadMushrooms();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Found Mushrooms 🍄</Text>
      {mushrooms.length === 0 ? (
        <Text style={styles.empty}>No mushrooms found yet.</Text>
      ) : (
        <FlatList
          data={mushrooms}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.name}>{item.name}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#121212" },
  title: { color: "white", fontSize: 22, marginBottom: 20 },
  empty: { color: "#aaa", fontStyle: "italic" },
  card: { marginBottom: 20 },
  image: { width: "100%", height: 200, borderRadius: 10 },
  name: { color: "white", marginTop: 10 },
});

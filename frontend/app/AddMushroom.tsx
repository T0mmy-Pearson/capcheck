import { View, Text, TextInput, Button, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function AddMushroom() {
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  const handleSave = async () => {
    if (!name || !image) return
    const existing = await AsyncStorage.getItem("foundMushrooms")
    const mushrooms = existing ? JSON.parse(existing) : []
    mushrooms.push({ name, image })
    await AsyncStorage.setItem("foundMushrooms", JSON.stringify(mushrooms))
    // router.push(`/........../${mushroomId}`) <--- must look agt the api to complete request
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Mushroom Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Chanterelle" placeholderTextColor="#aaa" />
      <Button title="Pick Image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Save Mushroom" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#121212" },
  label: { color: "white", marginBottom: 5, marginTop: 20 },
  input: { backgroundColor: "#1e1e1e", color: "white", padding: 10, borderRadius: 5 },
  image: { width: "100%", height: 200, borderRadius: 10, marginTop: 20, marginBottom: 20 },
});

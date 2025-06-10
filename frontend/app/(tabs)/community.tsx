import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { Button } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import CommunityPost, { Post } from "@/components/CommunityPost";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchPhotos } from "../../utils/api";

import * as ImagePicker from "expo-image-picker";


type RootStackParamList = {
  UploadPost: undefined;
};

export default function TabTwoScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    const setup = async () => {
      await AsyncStorage.setItem("userId", "1");
    };
    setup();
  }, []);


  const loadPosts = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      if (!storedUserId) {
        console.warn("No userId found in AsyncStorage");
        return;
      }

      const res = await fetchPhotos({ userId: Number(storedUserId) });
      setPosts(res.data.userphotos);
    } catch (err) {
      console.error("Error loading posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (!storedUserId) {
          console.warn("No userId found in AsyncStorage");
          return;
        }

        const res = await fetchPhotos({ userId: Number(storedUserId) });
        setPosts(res.data.userphotos);
      } catch (err) {
        console.error("Error loading posts:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!imageUri || !caption) {
      Alert.alert("Missing fields", "Please select an image and add a caption.");
      return;
    }

    const storedUserId = await AsyncStorage.getItem("userId");

    const formData = new FormData();
    formData.append("photo", {
      uri: imageUri,
      name: "upload.jpg",
      type: "image/jpeg",
    } as any);
    formData.append("caption", caption);
    formData.append("userId", storedUserId || "1");

    try {
      const res = await fetch("https://capcheck.onrender.com/api/userphotos", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.ok) {
        Alert.alert("Success", "Photo uploaded!");
        setImageUri(null);
        setCaption("");
        loadPosts(); 
      } else {
        Alert.alert("Upload failed", "Please try again.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Image
          source={require("@/assets/images/1000_F_370951245_vWF0oLH6WRDT5kb9Anvl4HbLCJBBX3XI.jpg")}
          style={styles.reactLogo}
        />
      }
    >
      <View style={styles.container}>
        <Button color="black" onPress={() => navigation.navigate("UploadPost")}>
          Take Photo
        </Button>

        <View style={styles.uploadSection}>
          <Button onPress={pickImage}>Choose Image</Button>
          {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}
          <TextInput
            placeholder="Enter caption..."
            value={caption}
            onChangeText={setCaption}
            style={styles.input}
          />
          <Button onPress={handleUpload} disabled={!imageUri || !caption}>
            Upload
          </Button>
        </View>

        <ThemedText style={styles.intro}>
          Welcome to the community! Like, comment, and explore mushrooms found by others.
        </ThemedText>

        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 30 }} />
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <CommunityPost post={item} />}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: "#f5f5f5",
  },
  intro: {
    marginVertical: 12,
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  reactLogo: {
    width: "100%",
    height: 220,
    resizeMode: "cover",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,

  },
  uploadSection: {
    marginTop: 20,
    gap: 10,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    backgroundColor: "#fff",
  },
  preview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginVertical: 10,

  },
});

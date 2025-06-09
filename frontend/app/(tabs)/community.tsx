import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Button } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import CommunityPost, { Post } from "@/components/CommunityPost";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchPhotos } from "../../utils/api";

// Define RootStackParamList or import it from your navigation types file
type RootStackParamList = {
  UploadPost: undefined;
  // Add other routes here as needed
};

export default function TabTwoScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setup = async () => {
      await AsyncStorage.setItem("userId", "1");
    };
    setup();
  }, []);

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
          Post Photo
        </Button>

        <ThemedText style={styles.intro}>
          Welcome to the community! Like, comment, and explore mushrooms found
          by others.
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
});

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import CommunityPost, { Post } from "@/components/CommunityPost";

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
    fetch("https://capcheck.onrender.com/api/userphotos")
      .then((res) => res.json())
      .then((data) => {
        const enriched = data.userphotos.map((item: any) => ({
          id: item.photoId,
          user: {
            username: `User ${item.userId}`,
            avatarUrl: `https://i.pravatar.cc/100?u=${item.userId}`,
          },
          photoUrl: item.photo,
          caption: `Mushroom ID: ${item.mushroomId}`,
          likes: Math.floor(Math.random() * 100),
          liked: false,
          timestamp: "1h ago",
          comments: [],
        }));
        setPosts(enriched);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading posts:", err);
        setLoading(false);
      });
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
  intro: {
    marginVertical: 16,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  scrollcontainer: {
    paddingBottom: 80,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  buttonTitle: {
    color: "#808080",
    position: "absolute",
    bottom: 0,
  },
  reactLogo: {
    width: 630,
    height: 300,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  testBoxing: {
    margin: 30,
    padding: 10,
    width: 500,
    height: 450,
    borderColor: "black",
    borderWidth: 3,
    borderRadius: 10,
  },
  testBoxing2: {
    alignItems: "center",
    margin: 30,
    padding: 10,
    width: 250,
    borderColor: "black",
    borderWidth: 3,
    borderRadius: 10,
  },
});

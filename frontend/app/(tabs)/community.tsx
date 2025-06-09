import { Image } from "react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView } from "react-native";

// Define RootStackParamList or import it from your navigation types file
type RootStackParamList = {
  UploadPost: undefined;
  // Add other routes here as needed
};

export default function TabTwoScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://capcheck.onrender.com/api/userphotos")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.userphotos || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading posts:", err);
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollcontainer}>
        <ParallaxScrollView
          headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
          headerImage={
            <Image
              source={require("@/assets/images/1000_F_370951245_vWF0oLH6WRDT5kb9Anvl4HbLCJBBX3XI.jpg")}
              style={styles.reactLogo}
            />
          }
        >
          <View style={styles.testBoxing}>
            <Image
              source={require("@/assets/images/Hen-Wood-1.jpg")}
              style={{
                width: 200,
                height: 200,
                margin: 30,
                padding: 10,
                borderColor: "black",
                borderWidth: 3,
                borderRadius: 10,
              }}
            ></Image>

            <ThemedText style={styles.testBoxing2}>
              community section with usr of the month or something, able to
              comment, like, see location?
            </ThemedText>
          </View>

          <ThemedText>leave comments and likes on peoples posts</ThemedText>
          <ThemedText>
            fun little feature, most liked photo /user of the week maybe
          </ThemedText>
          <Button
            color="black"
            onPress={() => navigation.navigate("UploadPost")}
          >
            Post Photo
          </Button>
          <ThemedText>
            search bar to explore by desitnation or mushroom
          </ThemedText>
          <ThemedText>
            archive of other peoples locations/mushrooms etcs
          </ThemedText>
        </ParallaxScrollView>
      </ScrollView>
      {/* <View style={styles.footer}>
    

    </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
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

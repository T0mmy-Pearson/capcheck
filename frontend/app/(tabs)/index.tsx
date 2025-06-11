import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Randomiser from "@/components/Randomiser";
import OpenMeteoWeather from "@/components/OpenMeteo";


export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <View style={styles.logoContainer}>
  <Image
    source={require("@/assets/images/image.png")}
    style={styles.reactLogo}
  />
</View>
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">CAP CHECK 🍄</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">
      Is your pocket guide to mushroom foraging fun! Snap, log, and share your fungi finds while connecting with fellow fungi finders on the community page. Whether you're spotting something strange or showing off a rare cap, CapCheck makes mushroom adventures even more magical.
        </ThemedText>
      </ThemedView>
      
      <View style={styles.mushroomFact}>
        <Randomiser />
      </View>
      <View style={{ width: "100%" }}>
      <OpenMeteoWeather />
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  widget: {
    width: "100%"
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  mushroomFact: {
    alignItems: "center",
    width: "100%",
    paddingVertical: 16,
  },
  reactLogo: {
  width: 200, 
  height: 200,
  resizeMode: "cover", 
  alignSelf: "center",
  marginTop: 40,
},
logoContainer: {
  backgroundColor: "#f5f5f5", 
  alignItems: "center",
  paddingVertical: 10,
},
});

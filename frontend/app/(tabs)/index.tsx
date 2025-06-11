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
        <Image
          source={require("@/assets/images/1000_F_370951245_vWF0oLH6WRDT5kb9Anvl4HbLCJBBX3XI.jpg")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Cap Check 🍄</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">
          Map feature with extended drop down features possibly
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">community based pop feature</ThemedText>
      </ThemedView>
      <View style={styles.mushroomFact}>
        <Randomiser />
      </View>
      <OpenMeteoWeather></OpenMeteoWeather>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
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
    width: 630,
    height: 300,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});

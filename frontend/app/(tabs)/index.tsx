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
      
      <ThemedView style={styles.stepContainer}>
  <View style={styles.textBox}>
    <ThemedText type="subtitle" style={styles.blackText}>
      This is your pocket guide to mushroom foraging fun! Snap, log, and share your fungi finds while connecting with fellow fungi finders on the community page. Whether you're spotting something strange or showing off a rare cap, CapCheck makes mushroom adventures even more magical.
    </ThemedText>
  </View>
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
  blackText: {
    color: 'black',
    textAlign: 'justify',
  },
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
  backgroundColor: "#fdf8ef", 
  alignItems: "center",
  paddingVertical: 10,
},
textBox: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
    width: '100%',
  },
});

import { Image, Text } from "react-native";
import { Platform, StyleSheet, View } from "react-native";
import { Collapsible } from "@/components/Collapsible";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@react-navigation/elements";
import { red } from "react-native-reanimated/lib/typescript/Colors";

export default function TabTwoScreen() {
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
          community section with usr of the month or something, able to comment, like, see location?
        </ThemedText>
      </View>
      <Button color="black">post photo</Button>
      <ThemedText>leave comments and likes on peoples posts</ThemedText>
      <ThemedText>
        fun little feature, most liked photo /user of the week maybe
      </ThemedText>
      <ThemedText>search bar to explore by desitnation or mushroom</ThemedText>
      <ThemedText>
        archive of other peoples locations/mushrooms etcs
      </ThemedText>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
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
  },
  reactLogo: {
    width: 630,
    height: 300,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  testBoxing: {
    alignItems: "left",
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

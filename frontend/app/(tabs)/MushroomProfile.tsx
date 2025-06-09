import { BodyText } from "@/components/BodyText";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";

export default function MushroomProfile() {

  const mushroom = {

  "mushroomId": 179,
"name": "Clustered Domecap",
"scientificName": "Lyophyllum decastes",
"description": "This is a large, frequent, and edible mushroom noted for its groups of ten or more caps - its scientific species name, decastes, means groups of ten. It often grows near gravel paths and roads and is associated with trees. Although a good edible it is also known to cause gastric upset in some people so only a small amount should be eaten first time.",
"cap": "The caps are brown and greasy, reaching 10cm and exceptionally 15cm. They start off convex and flatten with age sometimes developing a depressed centre and frequently a wavy edge.",
"stem": "White with fibres running along the length, sometimes a few brown fibres. 1.5 to 2.5cm thick and 3 to 5cm long. Straight to slightly tapering at base. Often connected to nearby stems in the cluster.",
"gills": "White, crowded gills, yellowinggreying with age. Adnate (straight) to adnexed (curvy) connection to the stem",
"pores": null,
"flesh": "White firm flesh",
"habitat": "Growing from the ground, NOT on wood. Often near or in gravel drives, paths and roads. Frequently associated with trees in grass.",
"otherFacts": "DNA analysis has shown that the Clustered Domecap is in fact part of 'species complex' of 5 or more separate but extremely similar and closely related species and is sometimes now referred to as Lypophyllum decastes s.l (senso lato = in broader sense).",
"start": "Aug",
"end": "Nov",
"capHeight": "5-7",
"capWidth": "5-10",
"edible": "Edible",
"imgUrl": "https:www.wildfooduk.comwp-contentuploads202203Clustered-domecap001.jpg"
  };

  function fixImgUrl(url: string | null | undefined) {
    if (!url) return undefined;

    const match = url.match(/(\d{4})(\d{2})([A-Za-z0-9\-\.]+)$/);
    if (!match) return url;

    const year = match[1];
    const month = match[2];
    const filename = match[3];

    return `https://www.wildfooduk.com/wp-content/uploads/${year}/${month}/${filename}`;
  }
  const correctedImgUrl = fixImgUrl(mushroom.imgUrl);

  function edibleIcon() {
    if (!mushroom.edible) return null;
    if (mushroom.edible === "Edible") return "🟢"; 
    if (mushroom.edible === "Inedible") return "🔴"; 
    if (mushroom.edible === "Poisonous") return "☠️"; 
  }

  /* 
  <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={
          <Image
          source={{ uri: correctedImgUrl }}
          style={styles.image}
        /> */

  return (
    <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={
          <Image
          source={{ uri: correctedImgUrl }}
          style={styles.image}
        />}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{mushroom.name}</Text>
        <BodyText style={styles.scientific}>{mushroom.scientificName}</BodyText>
      </View>
  

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 20 }}>
        <BodyText style={styles.text}>{mushroom.edible}</BodyText>
        <BodyText style={styles.text}>{edibleIcon()}</BodyText>
        <BodyText style={styles.text}>{mushroom.start} - {mushroom.end}</BodyText>
      </View>

      <BodyText style={styles.label}>Description:</BodyText>
      <BodyText style={styles.text}>{mushroom.description}</BodyText>

      {mushroom.stem && (
        <>
          <BodyText style={styles.label}>Stem:</BodyText>
          <BodyText style={styles.text}>{mushroom.stem}</BodyText>
        </>
      )}

      {mushroom.gills && (
        <>
          <BodyText style={styles.label}>Gills:</BodyText>
          <BodyText style={styles.text}>{mushroom.gills}</BodyText>
        </>
      )}
      {mushroom.pores && (
        <>
          <BodyText style={styles.label}>Pores:</BodyText>
          <BodyText style={styles.text}>{mushroom.pores}</BodyText>
        </>
      )}
      <BodyText style={styles.label}>Flesh:</BodyText>
      <BodyText style={styles.text}>{mushroom.flesh}</BodyText>
      <BodyText style={styles.label}>Habitat:</BodyText>
      <BodyText style={styles.text}>{mushroom.habitat}</BodyText>
      {mushroom.otherFacts && (
        <>
          <BodyText style={styles.label}>Facts:</BodyText>
          <BodyText style={styles.text}>{mushroom.otherFacts}</BodyText>
        </>
      )}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {mushroom.capHeight && (
          <>
            <BodyText style={styles.label}>Cap Height(CM):</BodyText>
            <BodyText style={styles.text}>{mushroom.capHeight}</BodyText>
          </>
        )}
        {mushroom.capWidth && (
          <>
            <BodyText style={styles.label}>Cap Width(CM):</BodyText>
            <BodyText style={styles.text}>{mushroom.capWidth}</BodyText>
          </>
        )}
      </View>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: { height: 60, marginTop: 20,},

  title: { fontSize: 34, fontWeight: "bold", color: "#ffffff", gap: 10,
   },

  scientific: { paddingTop: 10, fontSize: 24, fontStyle: "italic", color: "#666", marginBottom: 12 },
  image: { width: "100%", height: 270, borderRadius: 10, marginBottom: 16 },
  label: { fontWeight: "bold", marginTop: 2 },
  text: { fontSize: 16, marginTop: 2 },
});

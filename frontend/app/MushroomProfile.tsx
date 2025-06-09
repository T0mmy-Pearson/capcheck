import { BodyText } from "@/components/BodyText";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import fixImgUrl from "@/utils/fixImgUrl";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

export default function MushroomProfile() {
  const route = useRoute();
  const { mushroomId } = route.params as { mushroomId: number };

  const [mushroom, setMushroom] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    fetch(`https://capcheck.onrender.com/api/mushroom/${mushroomId}`)
      .then((data) => data.json())
      .then((data) => {
        setMushroom(data.mushroom);
        setLoading(false);
      });
  }, [mushroomId]);

  if (loading || !mushroom) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#888" />
      </View>
    );
  }

  const correctedImgUrl = fixImgUrl(mushroom.imgUrl);

  function edibleIcon() {
    if (!mushroom.edible) return null;
    if (mushroom.edible === "Edible") return <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="green" />;
    if (mushroom.edible === "Inedible") return <Octicons name="no-entry" size={24} color="red" />;
    if (mushroom.edible === "Poisonous") return <FontAwesome6 name="skull-crossbones" size={24} color="purple" />;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#000000", padding: 20 }}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={{ color: "white" }}>← Back</Text>
              </TouchableOpacity>
       <Image
          source={{ uri: correctedImgUrl }}
          style={styles.image}
        />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{mushroom.name}</Text>
        <BodyText style={styles.scientific}>{mushroom.scientificName}</BodyText>
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 20, paddingTop: 40 }}>
        <BodyText style={styles.text}>{mushroom.edible}</BodyText>
        <BodyText style={styles.text}>{edibleIcon()}</BodyText>
        <BodyText style={styles.text}>{mushroom.start} - {mushroom.end}</BodyText>
      </View>
      {mushroom.description && (
        <>
          <BodyText style={styles.label}>Description:</BodyText>
          <BodyText style={styles.text}>{mushroom.description}</BodyText>
        </>
      )}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: { height: 40, marginTop: 20, },
  title: { fontSize: 34, fontWeight: "bold", color: "#ffffff", gap: 10, },
  scientific: { fontSize: 24, fontStyle: "italic", color: "#666", marginBottom: 12 },
  image: { width: "100%", height: 270, borderRadius: 10, marginBottom: 16 },
  label: { fontWeight: "bold", marginTop: 2, paddingBottom: 10, color: "#ffffff" },
  text: { fontSize: 16, marginTop: 2, paddingBottom: 10, color: "#ffffff" },
});
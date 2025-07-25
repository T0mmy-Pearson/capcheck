import { SessionContext } from "@/app/contexts/SessionContext";
import { fetchMushroomById, fetchPhotosById } from "@/utils/api";
import { useContext, useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";


interface MushroomObject {
  name: string;
  mushroomId: number;
}

interface PhotoData {
  photo: string;
  photoId: number;
  userId: number;
  latitude: string;
  longitude: string;
  mushroomId: number;
}
const DUMMY_USER_ID = 1;


type RootStackParamList = {
  MushroomProfile: { mushroomId: number };
};

const FoundMushroomList = () => {
  const { defaultValue: userIdFromContext } = useContext(SessionContext);
  const userId = userIdFromContext ?? DUMMY_USER_ID;
  const [mushroomArray, setMushroomArray] = useState<MushroomObject[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    setLoading(true);
    fetchPhotosById(userId)
      .then((res) => {
        const mushroomIdSet = new Set<number>();

        res.forEach((photoData: PhotoData) => {
          if (photoData.mushroomId) {
            mushroomIdSet.add(photoData.mushroomId);
          }
        });


        const mushroomIdArray = Array.from(mushroomIdSet);

        return Promise.all(
          mushroomIdArray.map((mushroomId) =>
            fetchMushroomById(mushroomId).then((res) => ({
              name: res.name,
              mushroomId: res.mushroomId,
            }))
          )
        );
      })
      .then((results) => {
        setMushroomArray(results);
      })
      .catch((error) => {
        console.error("Error fetching mushrooms:", error);
        setMushroomArray([]);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="title" style={styles.heading}>
        Mushrooms I've Found
      </ThemedText>
      {loading ? (
        <ThemedText style={styles.loadingText}>Loading...</ThemedText>
      ) : mushroomArray.length === 0 ? (
        <ThemedText style={styles.loadingText}>No mushrooms found.</ThemedText>
      ) : (
        mushroomArray.map((mushroom) => (
          <TouchableOpacity
            key={mushroom.mushroomId}
            style={styles.card}
            onPress={() =>
              navigation.navigate("MushroomProfile", {
                mushroomId: mushroom.mushroomId,
              })
            }
          >
            <ThemedText style={styles.mushroomName}>
              {mushroom.name}
            </ThemedText>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 8,
    backgroundColor: "#000000",
    minHeight: "100%",
  },
  heading: {
    fontSize: 20,
    color: "#ffff",
    fontWeight: "400",
    marginBottom: 20,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#BBBBBB",
    marginTop: 12,
  },
  card: {
    backgroundColor: "#1F1F1F",
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 5,
  },
  mushroomName: {
    fontSize: 18,
    color: "#F0F0F0",
    fontWeight: "600",
  },
});



export default FoundMushroomList;
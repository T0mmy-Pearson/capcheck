import { Image } from "expo-image";
import ParallaxScrollViewUserProfile from "@/components/ParallaxScrollViewUserProfile";
import { ThemedText } from "@/components/ThemedText";
import { View, Text, TextInput, StyleSheet, useColorScheme, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserAvatar from "@/components/UserAvatar";
import PhotoCarousel from "@/components/PhotoCarousel";
import { useRouter } from "expo-router";
import { useState, useEffect, useContext } from "react";
import { SessionContext } from "../contexts/SessionContext";
import { fetchUserById } from "@/utils/api";
import FoundMushroomList from "@/components/FoundMushroomList";

interface UserObject {
  avatar: string;
  username: string;
  userId: number;
  score: number;
}

const DUMMY_USER_ID = 1;

export default function UserProfile() {
  const { defaultValue: userId } = useContext(SessionContext);
  const [userObject, setUserObject] = useState<UserObject>({
    avatar: "",
    username: "",
    userId: 0,
    score: 0,
  });

  const [bio, setBio] = useState("");
  const [editing, setEditing] = useState(false);
  const [bioInput, setBioInput] = useState("");
  const router = useRouter();
  const colorScheme = useColorScheme();

  const handleSave = async () => {
    await AsyncStorage.setItem("userBio", bioInput);
    setBio(bioInput);
    setEditing(false);
  };

  useEffect(() => {
    const loadUser = async () => {
      const idToUse = userId ?? DUMMY_USER_ID;
      try {
        const userData = await fetchUserById(idToUse);
        setUserObject(userData);
        console.log("Loaded user:", userData);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    loadUser();

    (async () => {
      const savedBio = await AsyncStorage.getItem("userBio");
      if (savedBio) setBio(savedBio);
    })();
  }, []);

  return (
    <View style={styles.pageContainer}>
      <ParallaxScrollViewUserProfile
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        headerImage={<Image />}
      >
        <UserAvatar {...userObject} />

        <View style={styles.avatarSeparator} />

        <Text style={styles.sectionHeader}>About Me</Text>
        <View style={styles.bioBox}>
          {editing ? (
            <>
              <TextInput
                style={styles.bioInput}
                value={bioInput}
                onChangeText={setBioInput}
                placeholder="Write your bio"
                placeholderTextColor="#aaa"
                multiline
              />
              <Pressable onPress={handleSave} style={styles.iconButton}>
                <Text style={styles.icon}>💾</Text>
                <Text style={styles.iconButtonText}>Save</Text>
              </Pressable>
            </>
          ) : (
            <>
              <ThemedText style={styles.bioText}>
                {bio || "Write your bio here..."}
              </ThemedText>
              <Pressable
                onPress={() => {
                  setBioInput(bio);
                  setEditing(true);
                }}
                style={styles.iconButton}
              >
                <Text style={styles.icon}>✏️</Text>
                <Text style={styles.iconButtonText}>Edit Bio</Text>
              </Pressable>
            </>
          )}
        </View>

        <View style={styles.avatarSeparator} />

        <Text style={styles.sectionHeader}>My Mushrooms</Text>
        <PhotoCarousel />
        <View style={{ marginTop: 0 }}>
          <View style={styles.avatarSeparator} />
          <FoundMushroomList />
        </View>
      </ParallaxScrollViewUserProfile>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  bioBox: {
    backgroundColor: "#0a84ff20",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#0a84ff",
    padding: 16,
    marginBottom: 12,
    shadowColor: "#0a84ff",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  bioText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "justify",
  },
  bioInput: {
    color: "#fff",
    fontSize: 16,
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#0a84ff",
    padding: 12,
    textAlignVertical: "top",
    minHeight: 80,
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 10,
    backgroundColor: "#0a84ff40",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  iconButtonText: {
    color: "#0a84ff",
    fontSize: 16,
  },
  icon: {
    fontSize: 18,
    color: "#0a84ff",
  },
  sectionHeader: {
    color: "#ffff",
    fontSize: 20,
    fontWeight: "400",
    marginBottom: 8,
  },
  avatarSeparator: {
    height: 1.5,
    backgroundColor: "#ffff",
    borderRadius: 1,
    opacity: 0.6,
    marginVertical: 12,
  },
});

import { Image } from "expo-image";
import ParallaxScrollViewUserProfile from "@/components/ParallaxScrollViewUserProfile";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "react-native";
import { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, StyleSheet, useColorScheme, Pressable, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserAvatar from "@/components/UserAvatar";
import PhotoCarousel from "@/components/PhotoCarousel";
import { useRouter } from "expo-router";
import { SessionContext } from "../contexts/SessionContext";
import { fetchUserById } from "@/utils/api";

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
        style={{ backgroundColor: "transparent" }} 
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
                placeholderTextColor="#888"
                multiline
                scrollEnabled={false}
              />
              <Pressable onPress={handleSave} style={styles.textButton}>
                <Text style={styles.textButtonText}>Save</Text>
              </Pressable>
            </>
          ) : (
            <>
              <ThemedText style={styles.bioText}>{bio || "Write your bio here..."}</ThemedText>
              <Pressable
                onPress={() => {
                  setBioInput(bio);
                  setEditing(true);
                }}
                style={styles.textButton}
              >
                <Text style={styles.textButtonText}>Edit Bio</Text>
              </Pressable>
            </>
          )}
        </View>

        <View style={styles.avatarSeparator} /> 

        <Text style={styles.sectionHeader}>My Mushrooms</Text>
        <PhotoCarousel />

        <View style={styles.fullWidthSeparator} /> 

        <ThemedText style={{ color: 'white', marginTop: 20 }}>post photo functionality</ThemedText>

        <Button title="View Found Mushrooms" onPress={() => router.push("/AddMushroom")} />
        <Button title="Add Mushroom" onPress={() => router.push("/FoundMushroom")} />
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
    backgroundColor: "#0000",  
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#0000", 
    shadowColor: "#0a84ff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  bioText: {
    color: "#ffff", 
    fontSize: 16,
    textAlign: "justify", 
  },
  bioInput: {
    color: "#cce4ff",
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: "top",
    padding: 8,
    backgroundColor: "#0000", 
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0a84ff",
  },

  sectionHeader: {
    color: "#ffff",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 20,
  },

  textButton: {
    marginTop: 8,
  },

  textButtonText: {
    color: "#0a84ff",
    fontSize: 16,
    textDecorationLine: "none",
  },

  avatarSeparator: {
    height: 1.5,
    backgroundColor: "#ffff",
    marginVertical: 18,
    marginHorizontal: 4,
    borderRadius: 1,
    opacity: 0.6,
  },

  fullWidthSeparator: {
    height: 1.5,
    backgroundColor: "#ffff",
    marginVertical: 18,
    borderRadius: 1,
    opacity: 0.6,
    width: "100%", 
  },
});

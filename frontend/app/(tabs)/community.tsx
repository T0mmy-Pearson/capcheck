// import React, { useEffect, useState } from "react";
// import {
//   View,
//   StyleSheet,
//   Image,
//   FlatList,
//   ActivityIndicator,
//   TextInput,
//   Alert,
// } from "react-native";
// import { Button } from "@react-navigation/elements";
// import { useNavigation } from "@react-navigation/native";
// import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import ParallaxScrollView from "@/components/ParallaxScrollView";
// import { ThemedText } from "@/components/ThemedText";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { fetchPhotos } from "../../utils/api";
// import CommunityPost from "@/components/CommunityPost";
// import * as ImagePicker from "expo-image-picker";
// type RootStackParamList = {
//   UploadPost: undefined;
// };
// export type Post = {
//   photoId: number;
//   photo: string;
//   caption: string;
//   username: string;
//   avatar_url: string;
//   latitude: number;
//   longitude: number;
//   mushroomId: number;
//   likes: number;
//   liked: boolean;
// };
// export default function TabTwoScreen() {
//   const navigation =
//     useNavigation<NativeStackNavigationProp<RootStackParamList>>();
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     const setup = async () => {
//       await AsyncStorage.setItem("userId", "1");
//     };
//     setup();
//   }, []);
//   useEffect(() => {
//     const loadPosts = async () => {
//       try {
//         const storedUserId = await AsyncStorage.getItem("userId");
//         if (!storedUserId) {
//           console.warn("No userId found in AsyncStorage");
//           return;
//         }
//         const res = await fetchPhotos({ userId: Number(storedUserId) });
//         setPosts(res.data.userphotos);
//       } catch (err) {
//         console.error("Error loading posts:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadPosts();
//   }, []);
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
//       headerImage={
//         <Image
//           source={require("@/assets/images/1000_F_370951245_vWF0oLH6WRDT5kb9Anvl4HbLCJBBX3XI.jpg")}
//           style={styles.reactLogo}
//         />
//       }
//     >
//       <View style={styles.container}>
//         <Button color="black" onPress={() => navigation.navigate("UploadPost")}>
//           Take Photo
//         </Button>
//         <ThemedText style={styles.intro}>
//           Welcome to the community! Like, comment, and explore mushrooms found by others.
//         </ThemedText>
//         {loading ? (
//           <ActivityIndicator size="large" style={{ marginTop: 30 }} />
//         ) : (
//           <FlatList
//             data={posts}
//             keyExtractor={(item) => item.photoId.toString()}
//             renderItem={({ item }) => <CommunityPost post={item} />}
//             contentContainerStyle={{ paddingBottom: 100 }}
//           />
//         )}
//       </View>
//     </ParallaxScrollView>
//   );
// }
// const styles = StyleSheet.create({
//   shadow: {
//     marginTop: 0,
//     marginBottom: 20,
//     borderRadius: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.4,
//     shadowRadius: 6,
//   },
//   container: {
//     flex: 1,
//     paddingHorizontal: 16,
//     paddingTop: 20,
//     backgroundColor: "#e8e8e8",
//   },
//   intro: {
//     marginVertical: 12,
//     fontSize: 16,
//     color: "#555",
//     textAlign: "center",
//   },
//   reactLogo: {
//     width: "100%",
//     height: 220,
//     resizeMode: "cover",
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,

//   },
//   uploadSection: {
//      marginTop: 20,
//     padding: 16,
//     gap: 10,
//     backgroundColor: "#f5f5f5",
//     borderRadius: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//   },
//   input: {
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 10,
//     padding: 10,
//     backgroundColor: "#fff",
//     color: "#222222",
//     fontSize: 16,
//     fontWeight: "500",
//   },
//   preview: {
//     width: "100%",
//     height: 200,
//     borderRadius: 10,
//     marginVertical: 10,
//     backgroundColor: "#ccc"
//   },
//   buttonTitle: {
//     color: "#f5f5f5"
//   },
//   greybutton: {
//     backgroundColor: "#f5f5f5"
//   }
// });

// import React, { useEffect, useState } from "react";
// import {
//   View,
//   StyleSheet,
//   Image,
//   FlatList,
//   ActivityIndicator,
//   TextInput,
//   Alert,
// } from "react-native";
// import { Button } from "@react-navigation/elements";
// import { useNavigation } from "@react-navigation/native";
// import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import ParallaxScrollView from "@/components/ParallaxScrollView";
// import { ThemedText } from "@/components/ThemedText";
// import CommunityPost from "@/components/CommunityPost";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { fetchPhotos } from "../../utils/api";
// import * as ImagePicker from "expo-image-picker";

// type RootStackParamList = {
//   UploadPost: undefined;
// };

// export type Post = {
//   id: number;
//   photoUrl: string;
//   user: {
//     id: number;
//     username: string;
//     avatar_url: string;
//   };
//   caption: string;
//   timestamp: string;
//   comments: Array<{
//     id: number;
//     user: {
//       id: number;
//       username: string;
//       avatar_url: string;
//     };
//     text: string;
//     timestamp: string;
//   }>;
//   latitude: number;
//   longitude: number;
//   mushroomId: number;
//   likes: number;
//   liked: boolean;
// };

// export default function TabTwoScreen() {
//   const navigation =
//     useNavigation<NativeStackNavigationProp<RootStackParamList>>();
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [imageUri, setImageUri] = useState<string | null>(null);
//   const [caption, setCaption] = useState("");

//   useEffect(() => {
//     const setup = async () => {
//       await AsyncStorage.setItem("userId", "1");
//     };
//       // Map API response to match the expected Post shape for CommunityPost
//       setPosts(
//         res.data.userphotos.map((item: any) => ({
//           id: item.photoId,
//           photoUrl: item.photo,
//           user: {
//             id: item.userId,
//             username: item.username,
//             avatar_url: item.avatar_url,
//           },
//           caption: item.caption,
//           timestamp: item.timestamp || new Date().toISOString(),
//           comments: item.comments || [],
//           latitude: item.latitude,
//           longitude: item.longitude,
//           mushroomId: item.mushroomId,
//           likes: item.likes,
//           liked: item.liked,
//         }))
//       );
//     loadPosts();
//   }, []);

//   const loadPosts = async () => {
//     try {
//       const storedUserId = await AsyncStorage.getItem("userId");
//       if (!storedUserId) {
//         console.warn("No userId found in AsyncStorage");
//         return;
//       }

//       const res = await fetchPhotos({ userId: Number(storedUserId) });
//       setPosts(res.data.userphotos);
//     } catch (err) {
//       console.error("Error loading posts:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 0.7,
//     });

//     if (!result.canceled && result.assets.length > 0) {
//       setImageUri(result.assets[0].uri);
//     }
//   };

//   const handleUpload = async () => {
//     if (!imageUri || !caption) {
//       Alert.alert("Missing fields", "Please select an image and add a caption.");
//       return;
//     }

//     const storedUserId = await AsyncStorage.getItem("userId");

//     const formData = new FormData();
//     formData.append("photo", {
//       uri: imageUri,
//       name: "upload.jpg",
//       type: "image/jpeg",
//     } as any);
//     formData.append("caption", caption);
//     formData.append("userId", storedUserId || "1");

//     try {
//       const res = await fetch("https://capcheck.onrender.com/api/userphotos", {
//         method: "POST",
//         body: formData,
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       if (res.ok) {
//         Alert.alert("Success", "Photo uploaded!");
//         setImageUri(null);
//         setCaption("");
//         loadPosts();
//       } else {
//         Alert.alert("Upload failed", "Please try again.");
//       }
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Something went wrong.");
//     }
//   };

//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
//       headerImage={
//         <Image
//           source={require("@/assets/images/1000_F_370951245_vWF0oLH6WRDT5kb9Anvl4HbLCJBBX3XI.jpg")}
//           style={styles.reactLogo}
//         />
//       }
//     >
//       <View style={styles.container}>
//         <Button color="black" onPress={() => navigation.navigate("UploadPost")}>
//               keyExtractor={(item) => item.id.toString()}
//               renderItem={({ item }) => <CommunityPost post={item} />}

//         <View style={styles.uploadSection}>
//           <View style={styles.greybutton}>
//             <Button color="black" onPress={pickImage}>Choose Image</Button>
//           </View>
//           {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}
//           <TextInput
//             placeholder="Enter caption..."
//             placeholderTextColor="#666"
//             value={caption}
//             onChangeText={setCaption}
//             style={styles.input}
//           />
//           <View style={styles.greybutton}>
//             <Button color="black" onPress={handleUpload} disabled={!imageUri || !caption}>
//               Upload
//             </Button>
//           </View>
//         </View>

//         <ThemedText style={styles.intro}>
//           Welcome to the community! Like, comment, and explore mushrooms found by others.
//         </ThemedText>

//         {loading ? (
//           <ActivityIndicator size="large" style={{ marginTop: 30 }} />
//         ) : (
//           <View style={styles.shadow}>
//             <FlatList
//               data={posts}
//               keyExtractor={(item) => item.photoId?.toString?.() || Math.random().toString()}
//               renderItem={({ item }) => <CommunityPost post={item} />}
//               contentContainerStyle={{ paddingBottom: 100 }}
//             />
//           </View>
//         )}
//       </View>
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   shadow: {
//     marginTop: 0,
//     marginBottom: 20,
//     borderRadius: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.4,
//     shadowRadius: 6,
//   },
//   container: {
//     flex: 1,
//     paddingHorizontal: 16,
//     paddingTop: 20,
//     backgroundColor: "#e8e8e8",
//   },
//   intro: {
//     marginVertical: 12,
//     fontSize: 16,
//     color: "#555",
//     textAlign: "center",
//   },
//   reactLogo: {
//     width: "100%",
//     height: 220,
//     resizeMode: "cover",
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//   },
//   uploadSection: {
//     marginTop: 20,
//     padding: 16,
//     gap: 10,
//     backgroundColor: "#f5f5f5",
//     borderRadius: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//   },
//   input: {
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 10,
//     padding: 10,
//     backgroundColor: "#fff",
//     color: "#222222",
//     fontSize: 16,
//     fontWeight: "500",
//   },
//   preview: {
//     width: "100%",
//     height: 200,
//     borderRadius: 10,
//     marginVertical: 10,
//     backgroundColor: "#ccc",
//   },
//   buttonTitle: {
//     color: "#f5f5f5",
//   },
//   greybutton: {
//     backgroundColor: "#f5f5f5",
//   },
// });

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { Button } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import CommunityPost from "@/components/CommunityPost";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { fetchPhotos } from "../../utils/api";

type RootStackParamList = {
  UploadPost: undefined;
};

export default function CommunityScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    const setup = async () => {
      await AsyncStorage.setItem("userId", "1");
      await loadPosts();
    };
    setup();
  }, []);

  const loadPosts = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      if (!storedUserId) return;
      const res = await fetchPhotos({ userId: Number(storedUserId) });
      setPosts(res.data.userphotos);
    } catch (err) {
      console.error("Error loading posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!imageUri || !caption) {
      Alert.alert(
        "Missing fields",
        "Please select an image and add a caption."
      );
      return;
    }

    const storedUserId = await AsyncStorage.getItem("userId");
    const formData = new FormData();
    formData.append("photo", {
      uri: imageUri,
      name: "upload.jpg",
      type: "image/jpeg",
    } as any);
    formData.append("caption", caption);
    formData.append("userId", storedUserId || "1");

    try {
      const res = await fetch("https://capcheck.onrender.com/api/userphotos", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.ok) {
        Alert.alert("Success", "Photo uploaded!");
        setImageUri(null);
        setCaption("");
        loadPosts();
      } else {
        Alert.alert("Upload failed", "Please try again.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong.");
    }
  };

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
      <View style={styles.container}>
        <View style={styles.greybutton}>
          <Button
            color="black"
            onPress={() => navigation.navigate("UploadPost")}
          >
            Go to Upload Page
          </Button>
        </View>

        <View style={styles.uploadSection}>
          <View style={styles.greybutton}>
            <Button color="black" onPress={pickImage}>
              Choose Image
            </Button>
          </View>
          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.preview} />
          )}
          <TextInput
            placeholder="Enter caption..."
            placeholderTextColor="#666"
            value={caption}
            onChangeText={setCaption}
            style={styles.input}
          />
          <View style={styles.greybutton}>
            <Button
              color="black"
              onPress={handleUpload}
              disabled={!imageUri || !caption}
            >
              Upload
            </Button>
          </View>
        </View>

        <ThemedText style={styles.intro}>
          Welcome to the community! Like, comment, and explore mushrooms found
          by others.
        </ThemedText>

        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 30 }} />
        ) : (
          <View style={styles.shadow}>
            <FlatList
              data={posts}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <CommunityPost post={item} />}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          </View>
        )}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  shadow: {
    marginTop: 0,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: "#e8e8e8",
  },
  intro: {
    marginVertical: 12,
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  reactLogo: {
    width: "100%",
    height: 220,
    resizeMode: "cover",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  uploadSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
    color: "#222222",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 10,
  },
  preview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: "#ccc",
  },
  buttonTitle: {
    color: "#f5f5f5",
  },
  greybutton: {
    marginVertical: 6,
  },
});

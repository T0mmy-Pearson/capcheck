import { Image } from "expo-image";
import ParallaxScrollViewUserProfile from "@/components/ParallaxScrollViewUserProfile"
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@react-navigation/elements";
import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, useColorScheme, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserAvatar from "@/components/UserAvatar";
import CheckBox from "@/components/CheckBox";
import { Ionicons } from '@expo/vector-icons';
import PhotoCarousel from "@/components/PhotoCarousel";
import { useRouter } from "expo-router";  
import { SessionContext } from "../contexts/SessionContext";
import { useContext } from "react";
import { fetchUserById } from "@/utils/api";




interface UserObject{
  avatar: string;
  username: string;
  userId: number;
  score: number;
}

const DUMMY_USER_ID = 1

export default function UserProfile() {
    const { defaultValue: userId } = useContext(SessionContext);
    const [userObject, setUserObject] = useState<UserObject>({
    avatar: '',
    username: '',
    userId: 0,
    score: 0,
  });

    // const {defaultValue: userId} = useContext(SessionContext);
    // const [userObject, setUserObject] = useState({});


    const [bio, setBio] = useState("");
    const [editing, setEditing] = useState(false);
    const [bioInput, setBioInput] = useState("");
    const [mushroom, setMushroom] = useState(false);
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
        <ParallaxScrollViewUserProfile
            headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
            headerImage={
                <Image />
            }
        >
            <UserAvatar {...userObject} />
            <Pressable
                style={styles.rowLink}
                onPress={() => router.push("/EditAccountInfoPage")} 
            >
                <Text style={styles.linkText}>Edit Account Info</Text>
                <Ionicons name="chevron-forward" size={20} color="white" />
            </Pressable>

            <View>
                <ThemedText>POINTS SCORE</ThemedText>
                {editing ? (
                    <>
                        <TextInput
                            style={{ color: 'white' }}
                            value={bioInput}
                            onChangeText={setBioInput}
                            placeholder="write your bio"
                        />
                        <Button style={styles.button} onPress={handleSave}><Text style={styles.text}>Save</Text></Button>
                    </>
                ) : (
                    <>
                        <ThemedText>{bio || "Write your bio here..."}</ThemedText>
                        <Button style={styles.button} onPress={() => { setBioInput(bio); setEditing(true) }}>
                            <Text style={styles.text}>Edit Bio ✏️</Text>
                        </Button>
                    </>
                )}
            </View>

            <ThemedText>Checklist/stats box links to other page</ThemedText>
            <PhotoCarousel />

            <ThemedText>post photo functionality</ThemedText>

            <Button title="View Found Mushrooms" onPress={() => router.push("/AddMushroom")} />
            <Button title="Add Mushroom" onPress={() => router.push("/FoundMushroom")} />

            <View style={styles.container}>
                <CheckBox
                    onPress={() => setMushroom(!mushroom)}
                    title="Mushroom1 move this around, maybe on to the mushroom profile page"
                    isChecked={mushroom}
                />
            </View>
        </ParallaxScrollViewUserProfile>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    button: {
        color: 'white',
        backgroundColor: '#948781'
    },
    text: {
        color: 'white',
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        width: 630,
        height: 300,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    rowLink: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
        paddingHorizontal: 10,
    },
    linkText: {
        color: 'white',
        fontSize: 16,
    },
});


// import { Image } from "expo-image";
// import ParallaxScrollViewUserProfile from "@/components/ParallaxScrollViewUserProfile"
// import { ThemedText } from "@/components/ThemedText";
// import { Button } from "@react-navigation/elements";
// import { useState, useEffect } from 'react';
// import { View, Text, TextInput, Appearance, StyleSheet, useColorScheme } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import UserAvatar from "@/components/UserAvatar";
// import CheckBox from "@/components/CheckBox";
// import { Pressable } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import  PhotoCarousel  from "@/components/PhotoCarousel"


// export default function UserProfile() {
//     const [bio, setBio] = useState("")
//     const [editing, setEditing] = useState(false)
//     const [bioInput, setBioInput] = useState("")
//     const [mushroom, setMushroom] = useState(false);
    
//     const colorScheme = useColorScheme();

//     useEffect(() => {
//         (async () => {
//             const savedBio = await AsyncStorage.getItem("userBio")
//             if (savedBio) setBio(savedBio)
//         })()
//     }, [])
//     const handleSave = async() => {
//         await AsyncStorage.setItem("userBio", bioInput)
//         setBio(bioInput)
//         setEditing(false)
//     }
//   return (
//     <ParallaxScrollViewUserProfile
//      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
//       headerImage={
//         <Image/>
//       }
//     >
//         <UserAvatar/>
//           <Pressable
//           style={styles.rowLink}
//           onPress={() => navigation.navigate("EditAccountInfoPage")}>
//         <Text style={styles.linkText}>Edit Account Info</Text>
//         <Ionicons name="chevron-forward" size={20} color="white" />
//         </Pressable>
//         <View>
//         <ThemedText>POINTS SCORE</ThemedText>
//         {editing ? (
//             <> <TextInput
//             style={{color: 'white'}}
//             value={bioInput}
//             onChangeText={setBioInput}
//             placeholder="write your bio"/>
//             <Button style={styles.button} onPress={handleSave}><Text style={styles.text}>Save</Text></Button></>) : (<><ThemedText>{bio || "Write your bio here..."}</ThemedText>
//             <Button style={styles.button} onPress={() => {setBioInput(bio); setEditing(true)}}><Text style={styles.text}>Edit Bio ✏️</Text></Button>
//         </>)}
//         </View>
//         <ThemedText>Checklist/stats box links to other page</ThemedText>
//         <PhotoCarousel></PhotoCarousel>
//         <ThemedText>post photo functionality</ThemedText>

//         <Button title="🧺 View Found Mushrooms" onPress={() => router.push("/found-mushrooms")} />
//         <Button title="➕ Add Mushroom" onPress={() => router.push("/add-mushroom")} />
        
//         <View style={styles.container}>
//             <CheckBox
//                 onPress={() => setMushroom(!mushroom)}
//                 title="Mushroom1 move this around, maybe on to the mushroom profile page"
//                 isChecked={mushroom}
//               />
//         </View>
//     </ParallaxScrollViewUserProfile>
//   )
// }


// const styles = StyleSheet.create({
//     titleContainer: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       gap: 8,
//     },
//     button: {
//       color: 'white',
//       backgroundColor: '#948781'
//     },
//     text: {
//       color: 'white',
//     },
//     stepContainer: {
//       gap: 8,
//       marginBottom: 8,
//     },
//     reactLogo: {
//       width: 630,
//       height: 300,
//       bottom: 0,
//       left: 0,
//       position: 'absolute',
//     },
//     container: {
//         flex: 1,
//         backgroundColor: "#fff",
//         justifyContent: "center",
//         alignItems: "center",
//       },
//       rowLink: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       paddingVertical: 12,
//       borderBottomWidth: 1,
//       borderBottomColor: '#444',
//       paddingHorizontal: 10,
//     },
//       linkText: {
//       color: 'white',
//       fontSize: 16,
//     },
//   });

 
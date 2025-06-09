import { Avatar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker'
import { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Alert, Image } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface UserObject{
  avatar: string;
  username: string;
  userId: number;
  score: number;
}

const UserAvatar = ( userObject: UserObject ) => {
  
  const [avatar, setAvatar] = useState('https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg')

  useEffect(() => {
    const loadAvatar = async() => {
      try {
        const savedAvatar = await AsyncStorage.getItem("userAvatar")
        if (savedAvatar) {
          setAvatar(savedAvatar)
        }
      } catch (error) {
        console.error("Avatar not loaded", error)
      }
    }
  loadAvatar()
  }, [])

  useEffect(() => {
    console.log(userObject)
    setAvatar(userObject.avatar)
  }, [userObject])
  
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri
      setAvatar(uri)
      try {
        await AsyncStorage.setItem("userAvatar", uri)
      } catch(error) {
        console.error("Avatar not saved", error)
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Account Info 🍄</Text>
      <View style={styles.avatar}>
        <Avatar
          size="large"
          rounded
          source={{ uri: avatar }}
        />
        <Avatar.Accessory
          size={30}
          onPress={handlePickImage}
        />
        
      </View>
      <Text style={styles.name}>John Doe</Text>
      <Text style={styles.email}>johndoe@example.com</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    image: {

    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#121212',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white',
    },
    avatar: {
        marginBottom: 20,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 10,
        color: 'white',
    },
    email: {
        fontSize: 16,
        color: 'gray',
    }
})


export default UserAvatar;

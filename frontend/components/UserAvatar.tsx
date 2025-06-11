import { Avatar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

interface UserObject {
  avatar: string;
  username: string;
  userId: number;  // make sure this is passed in!
  score: number;
}

const UserAvatar = ({ avatar, username, userId, score }: UserObject) => {
  const [localAvatar, setLocalAvatar] = useState('https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg');

  // Create unique key per user
  const storageKey = `userAvatar_${userId}`;

  useEffect(() => {
    const loadAvatar = async () => {
      try {
        const savedAvatar = await AsyncStorage.getItem(storageKey);
        if (savedAvatar) {
          setLocalAvatar(savedAvatar);
        } else if (avatar) {
          setLocalAvatar(avatar);
        }
      } catch (error) {
        console.error("Avatar not loaded", error);
      }
    };
    loadAvatar();
  }, [avatar, storageKey]);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setLocalAvatar(uri);
      try {
        await AsyncStorage.setItem(storageKey, uri);
      } catch (error) {
        console.error("Avatar not saved", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        <Avatar
          size={120}
          rounded
          source={{ uri: localAvatar }}
        />
        <TouchableOpacity onPress={handlePickImage} style={styles.cameraIconWrapper} activeOpacity={0.7}>
          <Ionicons name="camera" size={25} color="#0a84ff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.name}>{username}</Text>

      <Pressable onPress={() => router.push("/EditAccountInfoPage")}>
        <Text style={styles.editLink}>Edit Account Info</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  avatarWrapper: {
    position: 'relative',
  },
  cameraIconWrapper: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#0a84ff',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    color: 'white',
  },
  editLink: {
    color: '#4F8EF7',
    fontSize: 16,
    marginTop: 10,
  },
});

export default UserAvatar;


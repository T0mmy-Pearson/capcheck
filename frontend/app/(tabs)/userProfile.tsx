import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@react-navigation/elements";
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserAvatar from "@/components/UserAvatar";



import CheckBox from "../checkBox";



export default function UserProfile() {
    const [bio, setBio] = useState("")
    const [editing, setEditing] = useState(false)
    const [bioInput, setBioInput] = useState("")

    const [mushroom, setMushroom] = useState(false);

    useEffect(() => {
        (async () => {
            const savedBio = await AsyncStorage.getItem("userBio")
            if (savedBio) setBio(savedBio)
        })()
    }, [])
    const handleSave = async() => {
        await AsyncStorage.setItem("userBio", bioInput)
        setBio(bioInput)
        setEditing(false)
    }
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/1000_F_370951245_vWF0oLH6WRDT5kb9Anvl4HbLCJBBX3XI.jpg")} // user  image carousel
          style={styles.reactLogo}
        />
      }
    >
        <ThemedText type="title">Account Info 🍄</ThemedText>
        {/* add avatar  */}
        <UserAvatar></UserAvatar>
        <View>
        <ThemedText>USERNAME w/ score logo</ThemedText>
        {/* edit username */}
        {/* display email address */}
        {editing ? (
            <> <TextInput
            value={bioInput}
            onChangeText={setBioInput}
            placeholder="write your bio"/>
            <Button 
            children="Save"
            onPress={handleSave}
            ></Button></>
        ) : (<><ThemedText>{bio || "no bio :("}</ThemedText>
        <Button 
        children="edit bio"
        onPress={() => {setBioInput(bio); setEditing(true)}}></Button>
        </>)}
        </View>
        <ThemedText>Checklist/stats box links to other page</ThemedText>
        <ThemedText>Users Photos carousel links to all your photos</ThemedText>
        <ThemedText>post photo functionality</ThemedText>

        
        <View style={styles.container}>
            <CheckBox
                onPress={() => setMushroom(!mushroom)}
                title="Mushroom1 move this around, maybe on to the mushroom profile page"
                isChecked={mushroom}
              />
        </View>



    </ParallaxScrollView>
  );
}


const styles = StyleSheet.create({
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
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
  });

 
import React from 'react'
import { Avatar } from 'react-native-elements';
import { StyleSheet, View, Text, Alert } from "react-native";

const UserAvatar = () => {
    const handleEditAvatar = () => {
        Alert.alert("Edit Avatar", "Change Profile Picture")
    }
    return (
        <View>
            <Text>Account Info</Text>
                <Avatar size="small" rounded source={{ uri:'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',}}>
                <Avatar.Accessory size={30} icon={{name: "edit", color: "white"}} 
                onPress={handleEditAvatar}/>
                </Avatar>
            <Text>Name</Text>
            <Text>Email Address</Text>
        </View> 
    )
}

export default UserAvatar;

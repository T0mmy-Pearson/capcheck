import { Avatar } from 'react-native-elements';
import {StyleSheet, View, Text, Alert}  from "react-native";

const UserAvatar = () => {
    const handleEditAvatar = () => {
        Alert.alert("Edit Avatar", "Change Profile Picture")
    }
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Account Info</Text>
                <Avatar
                size="large"
                rounded
                source={{ uri:'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
                }}
                containerStyle={styles.avatar}
                >
                <Avatar.Accessory
                size={30}
                icon={{name: "edit", type: 'material', color: "white"}} 
                onPress={handleEditAvatar}
                />
                </Avatar>
            <Text style={styles.name}>John Doe</Text>
            <Text style={styles.email}>johndoe@gmail.com</Text>
        </View> 
    )
}

const styles = StyleSheet.create({
      container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
    header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  avatar: {
    marginBottom: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: 'gray',
  }
})

export default UserAvatar;

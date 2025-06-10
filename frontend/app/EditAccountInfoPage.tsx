import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from "@react-navigation/native";


// type EditAccountScreenProps = {
//   navigation: NativeStackNavigationProp<any>;
// };


export default function EditAccountScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigation = useNavigation<any>()
  useEffect(() => {
    (async () => {
      const storedName = await AsyncStorage.getItem("userName");
      const storedEmail = await AsyncStorage.getItem("userEmail");
      if (storedName) setName(storedName);
      if (storedEmail) setEmail(storedEmail);
    })();
  }, []);

  const handleSave = async () => {
    await AsyncStorage.setItem("userName", name);
    await AsyncStorage.setItem("userEmail", email);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={{ color: 'white' }}>← Back</Text>
        </TouchableOpacity>
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter your name" placeholderTextColor="#aaa" />
      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Enter your email" placeholderTextColor="#aaa" />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
    flex: 1,
    padding: 20,
  },
  label: {
    color: "white",
    marginBottom: 5,
    marginTop: 20,
  },
  input: {
    backgroundColor: "#1E1E1E",
    color: "white",
    padding: 10,
    borderRadius: 5,
  },
});

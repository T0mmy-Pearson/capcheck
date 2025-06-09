import React, { useEffect, useState } from 'react'
import { FlatList, TouchableOpacity, StyleSheet, View, Image } from 'react-native'
import { BodyText } from '@/components/BodyText'
import { useNavigation } from '@react-navigation/native';
import fixImgUrl from '@/utils/fixImgUrl';


export default function MushroomList() {
  
  const [mushrooms, setMushrooms] = useState([])
  const navigation = useNavigation<any>();

  useEffect(() => {
    fetch("https://capcheck.onrender.com/api/mushroom/")
      .then(res => res.json())
      .then(data => setMushrooms(data.mushrooms));
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={mushrooms}
        keyExtractor={item => item.mushroomId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            
            onPress={() => navigation.navigate("MushroomProfile", { mushroomId: item.mushroomId}

            )}
          >
            <BodyText>{item.name}</BodyText>
            <Image
                      source={{ uri: fixImgUrl(item.imgUrl) }}
                    />
            <BodyText>{item.scientificName}</BodyText>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingTop: 40,
    paddingHorizontal: 10
  },
  item: {
    backgroundColor: "#222",
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
  },
});

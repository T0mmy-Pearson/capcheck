import { SessionContext } from "@/app/contexts/SessionContext";
import { fetchMushroomById, fetchPhotosById } from "@/utils/api";
import { useContext, useEffect, useState } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";

interface MushroomObject {
    scientificName: string;
    mushroomId: number;
  }
  
  interface PhotoData {
    photo: string;
    photoId: number;
    userId: number;
    latitude: string;
    longitude: string;
    mushroomId: number;
  }

  interface MushroomData {
    scientificName: string;
    mushroomId: number;
  }

const FoundMushroomList = ()=>{
    const { defaultValue: userId } = useContext(SessionContext);
      const [mushroomArray, setMushroomArray] = useState<MushroomObject[]>([{
        scientificName: "Loading",
        mushroomId: 0
      }]);
    
      useEffect(() => {
        fetchPhotosById(userId)
        .then((res) => {
            const newMushroomArray: MushroomObject[] = [];
            const mushroomIdArray: number[] = [];
            res.forEach((photoData: PhotoData) => {
                if (!mushroomIdArray.includes(photoData["mushroomId"])){
                    mushroomIdArray.push(photoData["mushroomId"]);
                  }
                });
                mushroomIdArray.forEach((mushroomId:number)=>{
                    fetchMushroomById(mushroomId)
                    .then(res=>{
                        res.forEach((mushroomData: MushroomData)=>{
                            newMushroomArray.push({
                                scientificName: mushroomData.scientificName, 
                                mushroomId: mushroomData.mushroomId
                            })
                        })
                    })
                })
            setMushroomArray(newMushroomArray)
        });
        console.log(mushroomArray)
      }, [userId]);
    return <>
    <FlatList
            contentContainerStyle={{ paddingBottom: 20 }}
            data={mushroomArray}
            keyExtractor={(item) => item.mushroomId.toString()}
        renderItem={({ item }) => (
            <View>
                <ThemedText style={styles.bioText}>{item.scientificName}</ThemedText>
            </View>
        )}
        />
        <ThemedText style={styles.bioText}>some text</ThemedText>
        </>
}

const styles=StyleSheet.create({
    bioText: {
        color: "#fff", 
        fontSize: 16,
      }
})

export default FoundMushroomList
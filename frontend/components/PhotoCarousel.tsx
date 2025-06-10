import * as React from "react";
import { Dimensions, View, Image } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel"
import { ThemedText } from "./ThemedText";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "@/app/contexts/SessionContext";
import { fetchPhotosById } from "@/utils/api";
 
interface PhotoObject{
  photo: string;
}

interface PhotoData{
  photo: string;
  photoId: number
  userId: number;
  latitude: string;
  longitude: string;
  mushroomId: number;
}



const width = Dimensions.get("window").width;
 
function PhotoCarousel() {
  const { defaultValue: userId } = useContext(SessionContext);
  const [photoArray, setPhotoArray] = useState<PhotoObject[]>([]);

  useEffect(() => { 
    fetchPhotosById(userId).then((res) => {

      const newPhotoArray = res.map((photoData: PhotoData) => ({
        photo: photoData.photo,
      }))
      
      setPhotoArray(newPhotoArray)
    })
  }, [userId])

  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  
  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };
 
    return (
    <View style={{ flex: 1 }}>
      <Carousel
        ref={ref}
        width={width}
        height={width / 2}
        data={photoArray}
        onProgressChange={progress}
        renderItem={({ index }) => {
          const photoUri = photoArray[index]?.photo;
          return (
            <View
              style={{
                flex: 1,
                borderWidth: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {photoUri ? (
                <Image
                  source={{ uri: photoUri }}
                  style={{ width: width, height: width / 2, resizeMode: "cover" }}
                />
              ) : (
                <ThemedText style={{ textAlign: "center", fontSize: 30 }}>
                  No Image
                </ThemedText>
              )}
            </View>
          );
        }}
      />

      <Pagination.Basic
        progress={progress}
        data={photoArray}
        dotStyle={{ backgroundColor: "rgba(0, 0, 0, 0.72)", borderRadius: 50 }}
        containerStyle={{ gap: 5, marginTop: 10 }}
        onPress={onPressPagination}
      />
    </View>
  );
}

export default PhotoCarousel;

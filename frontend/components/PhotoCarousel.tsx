import * as React from "react";
import { Dimensions, View, Image, StyleSheet } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { ThemedText } from "./ThemedText";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "@/app/contexts/SessionContext";
import { fetchPhotosById } from "@/utils/api";

interface PhotoObject {
  photo: string;
}

interface PhotoData {
  photo: string;
  photoId: number;
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
      }));

      setPhotoArray(newPhotoArray);
    });
  }, [userId]);

  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <Carousel
        ref={ref}
        width={width -30}
        height={width -100}
        data={photoArray}
        onProgressChange={progress}
        renderItem={({ index }) => {
          const photoUri = photoArray[index]?.photo;
          return (
            <View style={styles.carouselItem}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.carouselImage} />
              ) : (
                <ThemedText style={styles.noImageText}>No Image</ThemedText>
              )}
            </View>
          );
        }}
      />
      <Pagination.Basic
        progress={progress}
        data={photoArray}
        dotStyle={styles.dotStyle}
        containerStyle={styles.paginationContainer}
        onPress={onPressPagination}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  carouselItem: {
    flex: 1,
    borderRadius: 16,
    borderColor: "white",
    borderWidth: 2,
    overflow: "hidden",
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  noImageText: {
    textAlign: "center",
    fontSize: 30,
  },
  dotStyle: {
    backgroundColor: "grey",
    borderRadius: 50,
    width: 10,
    height: 10,
    marginHorizontal: 3,
  },
  dotActiveStyle: {
    backgroundColor: "white",
    width: 12,
    height: 12,
    borderRadius: 50,
    marginHorizontal: 3,
  },
  paginationContainer: {
    marginTop: 10,
  },
});

export default PhotoCarousel;

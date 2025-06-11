import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CameraScreen() {
  const navigation = useNavigation();
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();
  const [uploading, setUploading] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!cameraPermission || !mediaPermission) return <View />;

  if (!cameraPermission.granted || !mediaPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to use the camera and save photos.
        </Text>
        <Button
          onPress={() => {
            requestCameraPermission();
            requestMediaPermission();
          }}
          title="Grant Permissions"
        />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function takePicture() {
    if (!cameraRef.current) return;

    try {
      setUploading(true);
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
      await MediaLibrary.saveToLibraryAsync(photo.uri);

      const userId = await AsyncStorage.getItem("userId");
      console.log("userId:", userId); // ✅ Debug
      if (!userId) throw new Error("Missing userId");

      const formData = new FormData();
      formData.append("photo", {
        uri: photo.uri,
        name: "upload.jpg",
        type: "image/jpeg",
      } as any);
      formData.append("latitude", "53.38176");
      formData.append("longitude", "-1.71751");
      formData.append("mushroomId", "2");
      formData.append("userId", userId);
      formData.append("caption", "Taken from camera");

      const response = await fetch(
        "https://capcheck.onrender.com/api/userphotos",
        {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json", // ✅ KEEP ONLY THIS
            // Do not add Content-Type
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("Failed to upload:", result);
        throw new Error(result?.message || "Upload failed");
      }

      console.log("Upload success:", result);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* 🔙 Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <TouchableOpacity
          style={styles.flipButton}
          onPress={toggleCameraFacing}
        >
          <Text style={styles.flipText}>🔄</Text>
        </TouchableOpacity>

        <View style={styles.captureContainer}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}
            disabled={uploading}
          >
            <View style={styles.innerCircle} />
          </TouchableOpacity>
        </View>
      </CameraView>

      {uploading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 40,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  loadingOverlay: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  flipButton: {
    position: "absolute",
    top: 43,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 10,
    borderRadius: 25,
    zIndex: 10,
  },
  flipText: {
    fontSize: 28,
    color: "white",
  },
  captureContainer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
});

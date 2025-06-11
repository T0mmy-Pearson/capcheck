import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import * as MediaLibrary from "expo-media-library";
import * as ImageManipulator from "expo-image-manipulator";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function CameraScreen() {
  const navigation = useNavigation();
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [uploading, setUploading] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"save" | "saved">("save");
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
      setSaveStatus("save");
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });

      let finalPhoto = photo;

      if (facing === "front") {
        const flipped = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ flip: ImageManipulator.FlipType.Horizontal }],
          { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
        );
        finalPhoto = flipped;
      }

      setPreviewUri(finalPhoto.uri);
    } catch (err) {
      console.error("Error taking picture:", err);
    } finally {
      setUploading(false);
    }
  }

  async function savePhoto() {
    if (!previewUri) return;

    try {
      setUploading(true);
      await MediaLibrary.saveToLibraryAsync(previewUri);
      console.log("Photo saved to camera roll");
      setSaveStatus("saved");
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setUploading(false);
    }
  }

  if (previewUri) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setPreviewUri(null)}
        >
          <Text style={styles.backButtonText}>← Retake</Text>
        </TouchableOpacity>

        <Image source={{ uri: previewUri }} style={{ flex: 1 }} resizeMode="cover" />

        <TouchableOpacity
          style={[styles.captureButton, { alignSelf: "center", margin: 20 }]}
          onPress={savePhoto}
          disabled={uploading || saveStatus === "saved"}
        >
          <Text style={{ color: "#000", fontWeight: "bold" }}>
            {uploading ? "Saving..." : saveStatus === "saved" ? "Saved" : "Save"}
          </Text>
        </TouchableOpacity>

        {uploading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/community")}
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

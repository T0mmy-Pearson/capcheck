import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as ImageManipulator from "expo-image-manipulator";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

export default function CameraScreen() {
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [flash, setFlash] = useState<"off" | "on">("off");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();

  const [saving, setSaving] = useState(false);
  const [capturedPhotoUri, setCapturedPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  if (!cameraPermission || !mediaPermission) return <View />;
  if (!cameraPermission.granted || !mediaPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to use the camera and save photos.
        </Text>
        <TouchableOpacity
          onPress={() => {
            requestCameraPermission();
            requestMediaPermission();
          }}
        >
          <Text style={styles.grantText}>Grant Permissions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  function toggleFlash() {
    setFlash((prev) => (prev === "off" ? "on" : "off"));
  }

  async function takePicture() {
    if (!cameraRef.current) return;

    try {
      setSaving(true);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        skipProcessing: true,
      });

      let finalUri = photo.uri;

      if (facing === "front") {
        const manipulated = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ flip: ImageManipulator.FlipType.Horizontal }],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );
        finalUri = manipulated.uri;
      }

      setCapturedPhotoUri(finalUri);
    } catch (err) {
      console.error("Capture error:", err);
    } finally {
      setSaving(false);
    }
  }

  async function savePhoto() {
    if (!capturedPhotoUri) return;

    try {
      setSaving(true);
      await MediaLibrary.saveToLibraryAsync(capturedPhotoUri);
      alert("Photo saved to camera roll!");
      setCapturedPhotoUri(null); 
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  }

  function handleRetake() {
    setCapturedPhotoUri(null);
  }

  return (
    <View style={styles.container}>
      {capturedPhotoUri ? (
        <>
          {/* Photo Preview */}
          <Image source={{ uri: capturedPhotoUri }} style={styles.camera} />

          {/* Retake Button */}
          <TouchableOpacity style={styles.backButton} onPress={handleRetake}>
            <Text style={styles.backButtonText}>↺ Retake</Text>
          </TouchableOpacity>

          {/* Save Button */}
          <View style={styles.captureContainer}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={savePhoto}
              disabled={saving}
            >
              <View style={styles.innerCircle} />
            </TouchableOpacity>
            <Text style={styles.saveText}>{saving ? "Saving..." : "Save"}</Text>
          </View>
        </>
      ) : (
        <>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/community")}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <CameraView
            style={styles.camera}
            facing={facing}
            flash={flash}
            ref={cameraRef}
          >
            {/* Flash Button */}
            <TouchableOpacity
              style={[
                styles.flashButton,
                flash === "on" ? styles.flashOn : styles.flashOff,
              ]}
              onPress={toggleFlash}
            >
              <Text style={styles.flashEmoji}>⚡️</Text>
            </TouchableOpacity>

            {/* Flip Camera Button */}
            <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
              <Text style={styles.flipText}>🔄</Text>
            </TouchableOpacity>

            {/* Capture Button */}
            <View style={styles.captureContainer}>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={takePicture}
                disabled={saving}
              >
                <View style={styles.innerCircle} />
              </TouchableOpacity>
              <Text style={styles.saveText}>Take Photo</Text>
            </View>
          </CameraView>

          {saving && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  message: { textAlign: "center", paddingBottom: 40 },
  grantText: {
    color: "#007AFF",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "500",
  },
  camera: { flex: 1 },
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
    top: 50,
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
  flashButton: {
    position: "absolute",
    top: 50,
    left: "50%",
    marginLeft: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  flashOn: { backgroundColor: "#948781" },
  flashOff: { backgroundColor: "transparent" },
  flashEmoji: {
    fontSize: 24,
    color: "white",
  },
  captureContainer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    alignItems: "center",
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
  saveText: {
    marginTop: 10,
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});

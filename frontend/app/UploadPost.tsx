// import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
// import * as MediaLibrary from 'expo-media-library';
// import { useRef, useState } from 'react';
// import {
//   ActivityIndicator,
//   Button,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// export default function App() {
//   const [facing, setFacing] = useState<'front' | 'back'>('back');
//   const [cameraPermission, requestCameraPermission] = useCameraPermissions();
//   const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
//   const [uploading, setUploading] = useState(false);
//   const cameraRef = useRef<CameraView>(null);

//   if (!cameraPermission || !mediaPermission) return <View />;

//   if (!cameraPermission.granted || !mediaPermission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.message}>We need your permission to use the camera and save photos.</Text>
//         <Button onPress={() => {
//           requestCameraPermission();
//           requestMediaPermission();
//         }} title="Grant Permissions" />
//       </View>
//     );
//   }

//   function toggleCameraFacing() {
//     setFacing(current => (current === 'back' ? 'front' : 'back'));
//   }

//   async function takePicture() {
//     if (!cameraRef.current) return;

//     try {
//       setUploading(true);
//       const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });

//       // Save to camera roll
//       await MediaLibrary.saveToLibraryAsync(photo.uri);
//       console.log('Photo saved to camera roll.');

//       // Upload
//       const formData = new FormData();
//       formData.append('photo', {
//         uri: photo.uri,
//         name: 'photo.jpg',
//         type: 'image/jpg',
//       } as unknown as Blob);

//       const response = await fetch('https://capcheck.onrender.com/api/userphotos', {
//         method: 'POST',
//         body: formData,
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       if (response.ok) {
//         console.log('Photo uploaded successfully');
//       } else {
//         console.error('Upload failed');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     } finally {
//       setUploading(false);
//     }
//   }

//   return (
//     <View style={styles.container}>
//       <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
//             <Text style={styles.text}>Flip Camera</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.button} onPress={takePicture} disabled={uploading}>
//             <Text style={styles.text}>{uploading ? 'Uploading...' : 'Take & Save'}</Text>
//           </TouchableOpacity>
//         </View>
//       </CameraView>
//       {uploading && (
//         <View style={styles.loadingOverlay}>
//           <ActivityIndicator size="large" color="#fff" />
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   message: {
//     textAlign: 'center',
//     paddingBottom: 40,
//   },
//   camera: {
//     flex: 1,
//   },
//   buttonContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     backgroundColor: 'transparent',
//     margin: 64,
//   },
//   button: {
//     flex: 1,
//     alignSelf: 'flex-end',
//     alignItems: 'center',
//   },
//   text: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   loadingOverlay: {
//     position: 'absolute',
//     bottom: 50,
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//   },
// });


import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Constants from 'expo-constants';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { MaterialIcons } from '@expo/vector-icons';
import Button from './src/components/Button';

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const savePicture = async () => {
    if (image) {
      try {
        const asset = await MediaLibrary.createAssetAsync(image);
        alert('Picture saved! 🎉');
        setImage(null);
        console.log('saved successfully');
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {!image ? (
        <Camera
          style={styles.camera}
          type={type}
          ref={cameraRef}
          flashMode={flash}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 30,
            }}
          >
            <Button
              title=""
              icon="retweet"
              onPress={() => {
                setType(
                  type === CameraType.back ? CameraType.front : CameraType.back
                );
              }}
            />
            <Button
              onPress={() =>
                setFlash(
                  flash === Camera.Constants.FlashMode.off
                    ? Camera.Constants.FlashMode.on
                    : Camera.Constants.FlashMode.off
                )
              }
              icon="flash"
              color={flash === Camera.Constants.FlashMode.off ? 'gray' : '#fff'}
            />
          </View>
        </Camera>
      ) : (
        <Image source={{ uri: image }} style={styles.camera} />
      )}

      <View style={styles.controls}>
        {image ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 50,
            }}
          >
            <Button
              title="Re-take"
              onPress={() => setImage(null)}
              icon="retweet"
            />
            <Button title="Save" onPress={savePicture} icon="check" />
          </View>
        ) : (
          <Button title="Take a picture" onPress={takePicture} icon="camera" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#000',
    padding: 8,
  },
  controls: {
    flex: 0.5,
  },
  button: {
    height: 40,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#E9730F',
    marginLeft: 10,
  },
  camera: {
    flex: 5,
    borderRadius: 20,
  },
  topControls: {
    flex: 1,
  },
});

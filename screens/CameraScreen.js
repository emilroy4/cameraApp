import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import RNPickerSelect from 'react-native-picker-select';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default to English

  // Define languages with flag emojis
  const languages = [
    { label: '🇺🇸 English', value: 'en' },
    { label: '🇪🇸 Spanish', value: 'es' },
    { label: '🇫🇷 French', value: 'fr' },
    { label: '🇯🇵 Japanese', value: 'ja' },
    { label: '🇨🇳 Chinese', value: 'zh' },
    { label: '🇩🇪 German', value: 'de' },
    { label: '🇮🇳 Hindi', value: 'hi' },
    // Add more languages with respective flag emojis
  ];

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const openCamera = async () => {
    if (hasPermission === false) {
      Alert.alert("Camera permission is required to use this feature.");
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.cancelled) {
        setPhotoUri(result.uri);
      }
    } catch (error) {
      console.error("Error opening camera:", error);
    }
  };

  const pickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.cancelled) {
        setPhotoUri(result.uri);
      }
    } catch (error) {
      console.error("Error picking image from gallery:", error);
    }
  };

  const handleTranslate = async () => {
    if (!photoUri || !selectedLanguage) {
      Alert.alert('Please select a language and take or select a picture first.');
      return;
    }

    console.log('Selected language:', selectedLanguage);
    console.log('Photo URI:', photoUri);

    // You can send the photoUri and selectedLanguage to your backend for processing
    // e.g., via fetch or axios request
  };

  if (hasPermission === null) {
    return <View><Text>Requesting camera permission...</Text></View>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera.</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Language Picker with Flag Emojis */}
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(value) => setSelectedLanguage(value)}
          items={languages}
          style={pickerSelectStyles}
          placeholder={{ label: '🌐 Select a language', value: null }}
          value={selectedLanguage}
        />
      </View>

      {photoUri ? (
        <>
          <Image source={{ uri: photoUri }} style={styles.imagePreview} />
          <Button title="Take Another Picture" onPress={() => setPhotoUri(null)} />
          <Button title="Translate" onPress={handleTranslate} />
        </>
      ) : (
        <>
          <Button title="Open Camera" onPress={openCamera} />
          <Button title="Pick from Gallery" onPress={pickFromGallery} />
        </>
      )}
    </View>
  );
}

// New picker styles
const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    backgroundColor: '#f0f0f0',
    width: 300,
    textAlign: 'center',
    paddingRight: 30, // for icon spacing
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    backgroundColor: '#f0f0f0',
    width: 300,
    textAlign: 'center',
    paddingRight: 30, // for icon spacing
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    marginBottom: 20,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});

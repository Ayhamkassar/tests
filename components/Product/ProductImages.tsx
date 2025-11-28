import React from "react";
import { View, ScrollView, Image, TouchableOpacity, StyleSheet, Text } from "react-native";
import * as ImagePicker from "react-native-image-picker";

interface ProductImagesProps {
  images: string[];
  setImages: (images: string[]) => void;
}

const ProductImages: React.FC<ProductImagesProps> = ({ images, setImages }) => {
  const pickImages = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: "photo",
        includeBase64: true,
        selectionLimit: 5,
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          alert("حدث خطأ أثناء اختيار الصورة");
          return;
        }
        if (response.assets) {
          const selectedBase64 = response.assets.map(
            asset => `data:${asset.type};base64,${asset.base64}`
          );
          setImages([...images, ...selectedBase64].slice(0, 5));
        }
      }
    );
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>صور المنتج</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {images.map((uri, idx) => (
          <View key={idx} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.imagePreview} />
            <TouchableOpacity style={styles.removeBtn} onPress={() => removeImage(idx)}>
              <Text style={styles.removeText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.addImageBtn} onPress={pickImages}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  label: { fontSize: 14, color: "#000", marginBottom: 5 },
  imagePreview: { width: 80, height: 80, borderRadius: 10 },
  addImageBtn: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  imageWrapper: { marginRight: 10 },
  removeBtn: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#dc2626",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  removeText: { color: "#fff", fontWeight: "bold" },
  addText: { color: "#2563eb", fontWeight: "bold" },
});

export default ProductImages;

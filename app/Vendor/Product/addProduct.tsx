import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import * as ImagePicker from "react-native-image-picker";

interface Product {
  name: string;
  price: string;
  stock: string;
  category: string;
  description: string;
  images: string[];
}

const AddProductPage: React.FC = () => {
  const [product, setProduct] = useState<Product>({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    images: [],
  });

  const handleChange = (field: keyof Product, value: string) => {
    setProduct({ ...product, [field]: value });
  };

  const pickImages = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: "photo",
        selectionLimit: 5,
        quality: 0.7,
      },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          const newImages = response.assets.map((asset) => asset.uri!);
          setProduct({ ...product, images: [...product.images, ...newImages] });
        }
      }
    );
  };

  const removeImage = (index: number) => {
    const updatedImages = product.images.filter((_, i) => i !== index);
    setProduct({ ...product, images: updatedImages });
  };

  const handleAddProduct = () => {
    console.log("✅ تمت إضافة المنتج:", product);
    // هنا ممكن تعمل API call
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>إضافة منتج جديد</Text>

      {[
        { label: "اسم المنتج", key: "name", placeholder: "أدخل اسم المنتج" },
        { label: "السعر (ل.س)", key: "price", placeholder: "أدخل السعر", numeric: true },
        { label: "الكمية بالمخزون", key: "stock", placeholder: "أدخل الكمية", numeric: true },
        { label: "التصنيف", key: "category", placeholder: "أدخل تصنيف المنتج" },
      ].map((item) => (
        <View style={styles.formGroup} key={item.key}>
          <Text style={styles.label}>{item.label}</Text>
          <TextInput
            style={styles.input}
            placeholder={item.placeholder}
            keyboardType={item.numeric ? "numeric" : "default"}
            value={(product as any)[item.key]}
            onChangeText={(v) => handleChange(item.key as keyof Product, v)}
          />
        </View>
      ))}

      {/* الوصف */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>الوصف</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          multiline
          placeholder="أدخل وصف المنتج"
          value={product.description}
          onChangeText={(v) => handleChange("description", v)}
        />
      </View>

      {/* اختيار الصور */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>صور المنتج</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {product.images.map((uri, idx) => (
            <View key={idx} style={styles.imageWrapper}>
              <Image source={{ uri }} style={styles.imagePreview} />
              <TouchableOpacity style={styles.removeBtn} onPress={() => removeImage(idx)}>
                <Text style={{ color: "#fff", fontWeight: "bold" }}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addImageBtn} onPress={pickImages}>
            <Text style={{ color: "#2563eb", fontWeight: "bold" }}>+</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* زر الإضافة */}
      <TouchableOpacity style={styles.btn} onPress={handleAddProduct}>
        <Text style={styles.btnText}>إضافة المنتج</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", color: "#000", textAlign: "center", marginBottom: 20 },
  formGroup: { marginBottom: 15 },
  label: { fontSize: 14, color: "#000", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#2563eb",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    color: "#000",
    backgroundColor: "#fff",
  },
  btn: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: 15 },
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
});

export default AddProductPage;

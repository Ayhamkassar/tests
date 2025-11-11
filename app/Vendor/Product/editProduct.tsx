import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

interface Product {
  id: string;
  name: string;
  price: string;
  stock: string;
  category: string;
  description: string;
  image: string;
}

const EditProductPage: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const initialProduct = useMemo<Product>(() => ({
    id: typeof params.productId === "string" ? params.productId : "",
    name: typeof params.name === "string" ? params.name : "",
    price: typeof params.price === "string" ? params.price : "",
    stock: typeof params.stock === "string" ? params.stock : "",
    category: typeof params.category === "string" ? params.category : "",
    description: typeof params.description === "string" ? params.description : "",
    image: typeof params.image === "string" ? params.image : "",
  }), [params]);

  const [product, setProduct] = useState<Product>(initialProduct);

  useEffect(() => {
    setProduct(initialProduct);
  }, [initialProduct]);

  const handleChange = (field: keyof Product, value: string) => {
    setProduct({ ...product, [field]: value });
  };

  const handleUpdateProduct = () => {
    console.log("✏️ تم تعديل المنتج:", product);
    // هون بتحط API لتحديث المنتج لاحقاً باستخدام product.id
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>✏️ تعديل المنتج</Text>

      {[
        { label: "اسم المنتج", key: "name" },
        { label: "السعر (ل.س)", key: "price", numeric: true },
        { label: "الكمية بالمخزون", key: "stock", numeric: true },
        { label: "التصنيف", key: "category" },
        { label: "رابط الصورة", key: "image" },
      ].map((item) => (
        <View style={styles.formGroup} key={item.key}>
          <Text style={styles.label}>{item.label}</Text>
          <TextInput
            style={styles.input}
            keyboardType={item.numeric ? "numeric" : "default"}
            value={String((product as any)[item.key] || "")}
            onChangeText={(v) => handleChange(item.key as keyof Product, v)}
          />
        </View>
      ))}

      <View style={styles.formGroup}>
        <Text style={styles.label}>الوصف</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          multiline
          value={product.description}
          onChangeText={(v) => handleChange("description", v)}
        />
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleUpdateProduct}>
        <Text style={styles.btnText}>حفظ التعديلات</Text>
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
});

export default EditProductPage;

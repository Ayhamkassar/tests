import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ProductInput from "../../../components/Product/ProductInput";

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
    setProduct(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateProduct = () => {
    console.log("تم تعديل المنتج:", product);
    Alert.alert("تم حفظ التعديلات بنجاح");
    router.back();
  };

  const fields = [
    { label: "اسم المنتج", key: "name" },
    { label: "السعر (ل.س)", key: "price", numeric: true },
    { label: "الكمية بالمخزون", key: "stock", numeric: true },
    { label: "التصنيف", key: "category" },
    { label: "رابط الصورة", key: "image" },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>تعديل المنتج</Text>

      {fields.map(field => (
        <ProductInput
          key={field.key}
          label={field.label}
          value={String((product as any)[field.key] || "")}
          numeric={field.numeric}
          onChange={v => handleChange(field.key as keyof Product, v)}
        />
      ))}

      <ProductInput
        label="الوصف"
        value={product.description}
        multiline
        onChange={v => handleChange("description", v)}
      />

      <TouchableOpacity style={styles.btn} onPress={handleUpdateProduct}>
        <Text style={styles.btnText}>حفظ التعديلات</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", color: "#000", textAlign: "center", marginBottom: 20 },
  btn: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: 15 },
});

export default EditProductPage;

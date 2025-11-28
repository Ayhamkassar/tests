import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import ProductInput from "../../../components/Product/ProductInput";
import ProductImages from "../../../components/Product/ProductImages";

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

  const handleAddProduct = async () => {
    if (!product.name || !product.price || !product.category) {
      return Alert.alert("الرجاء ملء جميع الحقول المطلوبة.");
    }

    const payload = {
      title: product.name,
      description: product.description,
      price: Number(product.price),
      categoryId: Number(product.category),
      imageUrls: product.images,
    };

    try {
      const response = await fetch("https://localhost:7084/api/Product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const msg = await response.text();
      console.log("📥 رد الخادم:", msg);

      if (!response.ok) throw new Error("فشل الإرسال");

      Alert.alert("تمت إضافة المنتج بنجاح");
      setProduct({ name: "", price: "", stock: "", category: "", description: "", images: [] });
    } catch (error) {
      console.log("❌ خطأ:", error);
      Alert.alert("حدث خطأ أثناء إضافة المنتج");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>إضافة منتج جديد</Text>

      <ProductInput
        label="اسم المنتج"
        value={product.name}
        placeholder="أدخل اسم المنتج"
        onChange={v => setProduct(prev => ({ ...prev, name: v }))}
      />

      <ProductInput
        label="السعر (ل.س)"
        value={product.price}
        placeholder="أدخل السعر"
        numeric
        onChange={v => setProduct(prev => ({ ...prev, price: v }))}
      />

      <ProductInput
        label="الكمية بالمخزون"
        value={product.stock}
        placeholder="أدخل الكمية"
        numeric
        onChange={v => setProduct(prev => ({ ...prev, stock: v }))}
      />

      <ProductInput
        label="التصنيف"
        value={product.category}
        placeholder="أدخل تصنيف المنتج"
        onChange={v => setProduct(prev => ({ ...prev, category: v }))}
      />

      <ProductInput
        label="الوصف"
        value={product.description}
        placeholder="أدخل وصف المنتج"
        multiline
        onChange={v => setProduct(prev => ({ ...prev, description: v }))}
      />

      <ProductImages
        images={product.images}
        setImages={images => setProduct(prev => ({ ...prev, images }))}
      />

      <TouchableOpacity style={styles.btn} onPress={handleAddProduct}>
        <Text style={styles.btnText}>إضافة المنتج</Text>
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

export default AddProductPage;

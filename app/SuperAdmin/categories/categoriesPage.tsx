import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

interface Category {
  id: string;
  name: string;
  productsCount: number;
  status: "نشط" | "غير نشط";
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [productsCount, setProductsCount] = useState("");
  const [status, setStatus] = useState<"نشط" | "غير نشط">("نشط");

  const addCategory = () => {
    // التحقق من الاسم
    if (!name.trim()) {
      Alert.alert("خطأ", "اسم التصنيف مطلوب");
      return;
    }

    // التحقق من عدد المنتجات
    const count = parseInt(productsCount);
    if (isNaN(count) || count < 0) {
      Alert.alert("خطأ", "عدد المنتجات يجب أن يكون رقم صحيح ≥ 0");
      return;
    }

    const newCategory: Category = {
      id: `C${Math.floor(Math.random() * 10000)}`,
      name: name.trim(),
      productsCount: count,
      status,
    };

    setCategories((prev) => [...prev, newCategory]);
    setName("");
    setProductsCount("");
    setStatus("نشط");

    Alert.alert("تم", "تم إضافة التصنيف بنجاح");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>إضافة تصنيف جديد</Text>

        <TextInput
          style={styles.input}
          placeholder="اسم التصنيف"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="عدد المنتجات"
          value={productsCount}
          onChangeText={setProductsCount}
          keyboardType="numeric"
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={status}
            style={styles.pickerStyle}
            onValueChange={(itemValue) => setStatus(itemValue)}
          >
            <Picker.Item label="نشط" value="نشط" />
            <Picker.Item label="غير نشط" value="غير نشط" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={addCategory}>
          <Ionicons name="add-circle-outline" size={22} color="#fff" />
          <Text style={styles.addBtnText}>إضافة تصنيف</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>جميع التصنيفات</Text>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.catName}>{item.name}</Text>
              <Text style={styles.catProducts}>{item.productsCount} منتج</Text>
              <Text
                style={[
                  styles.status,
                  { color: item.status === "نشط" ? "#2563eb" : "red" },
                ]}
              >
                {item.status}
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f7fb" },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12, color: "#000" },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db", // رمادي فاتح
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // أندرويد
  },
  
  pickerStyle: {
    color: "#111827", // نص غامق
    fontSize: 16,
    height: 50,
    paddingHorizontal: 12,
  },  
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#2563eb",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 16,
  },
  addBtnText: { color: "#fff", fontSize: 15, marginLeft: 6, fontWeight: "bold" },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8, color: "#000" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e6eefc",
  },
  catName: { fontWeight: "700", color: "#000" },
  catProducts: { fontWeight: "600", color: "#000" },
  status: { fontWeight: "700" },
});

export default CategoriesPage;

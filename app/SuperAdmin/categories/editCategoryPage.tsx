import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

interface Category {
  id: string;
  name: string;
  productsCount: number;
  status: "نشط" | "غير نشط";
}

const EditCategoryPage: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // استلام البيانات من params
  const category: Category | null = params.category ? JSON.parse(params.category as string) : null;

  if (!category) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>لا توجد بيانات للتعديل</Text>
      </View>
    );
  }

  const [name, setName] = useState(category.name);
  const [productsCount, setProductsCount] = useState(category.productsCount.toString());
  const [status, setStatus] = useState<Category["status"]>(category.status);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("خطأ", "اسم التصنيف مطلوب");
      return;
    }

    const count = parseInt(productsCount);
    if (isNaN(count) || count < 0) {
      Alert.alert("خطأ", "عدد المنتجات يجب أن يكون رقم صحيح ≥ 0");
      return;
    }

    const updatedCategory: Category = {
      ...category,
      name: name.trim(),
      productsCount: count,
      status,
    };

    // هنا يمكنك استدعاء API لتحديث التصنيف في السيرفر
    Alert.alert("تم", "تم تعديل التصنيف بنجاح");

    // العودة للصفحة السابقة
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>تعديل التصنيف</Text>

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
            onValueChange={(v) => setStatus(v)}
            style={styles.pickerStyle}
            dropdownIconColor="#2563eb"
          >
            <Picker.Item label="نشط" value="نشط" />
            <Picker.Item label="غير نشط" value="غير نشط" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={handleSave}>
          <Ionicons name="save-outline" size={22} color="#fff" />
          <Text style={styles.addBtnText}>حفظ التعديلات</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f7fb" },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16, color: "#000" },
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
    borderColor: "#d1d5db",
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pickerStyle: {
    color: "#111827",
    fontSize: 16,
    height: 50,
    paddingHorizontal: 12,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 10,
  },
  addBtnText: { color: "#fff", fontSize: 16, fontWeight: "700", marginLeft: 6 },
});

export default EditCategoryPage;

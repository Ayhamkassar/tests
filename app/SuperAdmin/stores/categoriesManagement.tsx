import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  SafeAreaView,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import Sidebar from "../../dashboard/sidebar";

interface Category {
  id: string;
  name: string;
  productsCount: number;
  status: "نشط" | "غير نشط";
}

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
};

const MOCK_CATEGORIES: Category[] = [
  { id: "C001", name: "إلكترونيات", productsCount: 120, status: "نشط" },
  { id: "C002", name: "ملابس", productsCount: 80, status: "نشط" },
  { id: "C003", name: "أحذية", productsCount: 40, status: "غير نشط" },
  { id: "C004", name: "إكسسوارات", productsCount: 60, status: "نشط" },
  { id: "C005", name: "منزلية", productsCount: 30, status: "غير نشط" },
];

const CategoriesManagement: React.FC = () => {
  const { width } = useWindowDimensions();
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const isMobile = width < 830;
  const isDesktop = width >= 1024;
  const chartWidth = isDesktop ? width * 0.45 : width - 40;

  const pieData = useMemo(
    () =>
      categories.map((c) => ({
        name: c.name,
        population: c.productsCount,
        color: getRandomColor(),
        legendFontColor: "#000",
        legendFontSize: 13,
      })),
    [categories]
  );

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(37,99,235,${opacity})`,
    labelColor: () => "#000",
    propsForBackgroundLines: { stroke: "#f0f0f0" },
  };

  return (
    <View style={{ flex: 1, flexDirection: isMobile ? "column" : "row" }}>
      <Sidebar />
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>إدارة التصنيفات</Text>
            <Text style={styles.subtitle}>تحكم بالتصنيفات المعروضة في النظام</Text>
          </View>

          {/* زر إضافة */}
          <TouchableOpacity style={styles.addBtn}>
            <Ionicons name="add-circle-outline" size={22} color="#fff" />
            <Text style={styles.addBtnText}>إضافة تصنيف جديد</Text>
          </TouchableOpacity>

          {/* الرسوم البيانية */}
          <View style={[styles.chartCard, isDesktop ? { width: chartWidth } : { width: "100%" }]}>
            <Text style={styles.chartTitle}>توزيع التصنيفات حسب عدد المنتجات</Text>
            <PieChart
              data={pieData as any}
              width={isDesktop ? chartWidth - 20 : chartWidth}
              height={240}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
              style={styles.chartStyle}
            />
          </View>

          {/* جدول التصنيفات */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>جميع التصنيفات</Text>
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.catName}>{item.name}</Text>
                    <Text style={styles.catId}>#{item.id}</Text>
                  </View>

                  <View style={{ flex: 1, alignItems: "center" }}>
                    <Text style={styles.catProducts}>{item.productsCount} منتج</Text>
                  </View>

                  <View style={{ flex: 1, alignItems: "center" }}>
                    <Text
                      style={[
                        styles.status,
                        { color: item.status === "نشط" ? "#2563eb" : "red" },
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>

                  <View style={styles.actions}>
                    <TouchableOpacity style={styles.editBtn}>
                      <Ionicons name="create-outline" size={20} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteBtn}>
                      <Ionicons name="trash-outline" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 60 }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f7fb" },
  container: { padding: 16 },
  header: { marginBottom: 12 },
  title: { fontSize: 22, fontWeight: "800", color: "#000" },
  subtitle: { color: "#666" },
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
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e6eefc",
  },
  chartTitle: { fontWeight: "700", fontSize: 16, marginBottom: 10, color: "#000" },
  chartStyle: { borderRadius: 12 },
  section: { marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8, color: "#000" },
  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#e6eefc",
    alignItems: "center",
    marginBottom: 8,
  },
  catName: { color: "#000", fontWeight: "700" },
  catId: { color: "#666", fontSize: 12 },
  catProducts: { color: "#000", fontWeight: "600" },
  status: { fontWeight: "700" },
  actions: { flexDirection: "row", gap: 8 },
  editBtn: {
    backgroundColor: "#2563eb",
    padding: 6,
    borderRadius: 6,
  },
  deleteBtn: {
    backgroundColor: "red",
    padding: 6,
    borderRadius: 6,
  },
});

export default CategoriesManagement;

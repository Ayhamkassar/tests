import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from "react-native-reanimated";
import { PieChart } from "react-native-chart-kit";
import VendorsSideBar from "../../dashboard/vendorsSideBar";

const screenWidth = Dimensions.get("window").width;

// ⭐ بيانات المنتجات
const initialProducts = [
  { id: "1", name: "سماعات بلوتوث", price: 80000, stock: 12, category: "إلكترونيات", image: "https://via.placeholder.com/120" },
  { id: "2", name: "لابتوب HP", price: 3500000, stock: 5, category: "إلكترونيات", image: "https://via.placeholder.com/120" },
  { id: "3", name: "ساعة ذكية", price: 250000, stock: 0, category: "إكسسوارات", image: "https://via.placeholder.com/120" },
  { id: "4", name: "قلم ذكي", price: 5000, stock: 8, category: "إكسسوارات", image: "https://via.placeholder.com/120" },
];

// 🟢 ألوان للفئات
const colors = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#8b5cf6"];

const menuItems = [
  { label: "الصفحة الرئيسية", icon: "home-outline", route: "/dashboard/dashboard" },
  { label: "إضافة منتج جديد", icon: "add-circle-outline", route: "/Vendor/Product/addProduct" },
  { label: "إدارة الطلبات", icon: "receipt-outline", route: "/Vendor/ordersManagement" },
  { label: "إدارة المراجعات", icon: "chatbubbles-outline", route: "/Vendor/others/reviews" },
  { label: "إدارة المخزون", icon: "cube-outline", route: "/Vendor/others/inventory" },
  { label: "إدارة التوصيلات", icon: "bicycle-outline", route: "/Vendor/deliveries" },
  { label: "إعدادات المتجر", icon: "settings-outline", route: "/Vendor/store/storeSettings" },
];

const inventory = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(4); // إدارة المخزون
  const [products, setProducts] = useState(initialProducts);

  const drawerX = useSharedValue(-260);
  const toggleDrawer = () => {
    drawerX.value = withTiming(drawerOpen ? -260 : 0, { duration: 300 });
    setDrawerOpen(!drawerOpen);
  };
  const animatedDrawerStyle = useAnimatedStyle(() => ({ left: drawerX.value }));

  const deleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const editProduct = (product: any) => {
    router.push({
      pathname: "/Vendor/Product/editProduct",
      params: { ...product },
    });
  };

  // 🔹 تجهيز بيانات Pie Chart حسب الفئة
  const categoryCounts: { [key: string]: number } = {};
  products.forEach((p) => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  const pieData = Object.keys(categoryCounts).map((key, index) => ({
    name: key,
    population: categoryCounts[key],
    color: colors[index % colors.length],
    legendFontColor: "#000",
    legendFontSize: 14,
  }));

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
    labelColor: () => "#000",
    decimalPlaces: 0,
  };

  return (
    <View style={styles.screen}>
      {screenWidth >= 1024 ? (
        <VendorsSideBar />
      ) : (
        <>
          <TouchableOpacity style={styles.menuBtn} onPress={toggleDrawer}>
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>
          {drawerOpen && <TouchableOpacity style={styles.overlay} onPress={toggleDrawer} />}
          <Animated.View style={[styles.drawer, animatedDrawerStyle]}>
            <Text style={styles.drawerTitle}>القائمة</Text>
            {menuItems.map((item, idx) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.drawerItem, idx === activeIndex && { backgroundColor: "#2563eb22" }]}
                onPress={() => {
                  setActiveIndex(idx);
                  router.replace(item.route as any);
                  toggleDrawer();
                }}
              >
                <Ionicons name={item.icon as any} size={20} color="#2563eb" />
                <Text style={styles.drawerText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </>
      )}

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.pageTitle}>إدارة المخزون</Text>

        {/* Pie Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>توزيع المنتجات حسب الفئة</Text>
          <PieChart
            data={pieData}
            width={screenWidth - 30}
            height={200}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>

        {/* قائمة المنتجات */}
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.productCard, item.stock === 0 && { borderColor: "#dc2626" }]}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productCategory}>{item.category}</Text>
                <Text style={styles.productPrice}>{item.price.toLocaleString()} ل.س</Text>
                <Text style={[styles.productStock, item.stock === 0 ? { color: "#dc2626" } : {}]}>
                  المخزون: {item.stock}
                </Text>
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.editBtn} onPress={() => editProduct(item)}>
                    <Text style={styles.editText}>تعديل</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteProduct(item.id)}>
                    <Text style={styles.deleteText}>حذف</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, flexDirection: screenWidth >= 1024 ? "row" : "column", backgroundColor: "#f5f5f5" },
  content: { flex: 1, backgroundColor: "#fff" },
  contentContainer: { padding: 15 },
  pageTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#000" },
  chartContainer: { marginBottom: 20, backgroundColor: "#fff", borderRadius: 15, padding: 10, elevation: 2, borderWidth: 1, borderColor: "#2563eb33" },
  chartTitle: { fontSize: 16, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#2563eb33",
  },
  productImage: { width: 100, height: 100, borderRadius: 10 },
  productName: { fontSize: 16, fontWeight: "bold", color: "#000" },
  productCategory: { fontSize: 14, color: "#6b7280", marginTop: 2 },
  productPrice: { fontSize: 15, color: "#000", fontWeight: "bold", marginTop: 2 },
  productStock: { fontSize: 14, marginTop: 2, color: "#16a34a" },
  actions: { flexDirection: "row", marginTop: 8 },
  editBtn: { backgroundColor: "#2563eb", borderRadius: 6, paddingVertical: 5, paddingHorizontal: 15, marginRight: 10 },
  editText: { color: "#fff", fontWeight: "bold" },
  deleteBtn: { backgroundColor: "red", borderRadius: 6, paddingVertical: 5, paddingHorizontal: 15 },
  deleteText: { color: "#fff", fontWeight: "bold" },
  menuBtn: { position: "absolute", top: 40, left: 20, zIndex: 20, backgroundColor: "#2563eb", padding: 10, borderRadius: 8 },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 9 },
  drawer: { position: "absolute", top: 0, left: 0, width: 250, height: "100%", backgroundColor: "#fff", paddingTop: 80, paddingHorizontal: 15, borderTopRightRadius: 20, borderBottomRightRadius: 20, zIndex: 10, elevation: 10 },
  drawerTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, color: "#2563eb" },
  drawerItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderRadius: 10, marginBottom: 8 },
  drawerText: { color: "#000", fontSize: 16, marginLeft: 10 },
});

export default inventory;

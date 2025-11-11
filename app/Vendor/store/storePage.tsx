import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from "react-native-reanimated";
import VendorsSideBar from "../../dashboard/vendorsSideBar";

const screenWidth = Dimensions.get("window").width;

// 🎨 ألوان عشوائية
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
};

// 📋 أزرار القائمة (نفس تبع VendorsSideBar)
const menuItems = [
  { label: "الصفحة الرئيسية", icon: "home-outline", route: "/dashboard/dashboard" },//finishied
  { label: "إضافة منتج جديد", icon: "add-circle-outline", route: "/Vendor/addProduct" },//finishied
  { label: "إدارة الطلبات", icon: "receipt-outline", route: "/Vendor/ordersManagement" },//finishied
  { label: "إدارة المراجعات", icon: "chatbubbles-outline", route: "/Vendor/reviews" },
  { label: "إدارة المخزون", icon: "cube-outline", route: "/Vendor/inventory" },
  { label: "إدارة التوصيلات", icon: "bicycle-outline", route: "/Vendor/deliveries" },
  { label: "إعدادات المتجر", icon: "settings-outline", route: "/Vendor/storeSettings" },
];

const StorePage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const drawerX = useSharedValue(-260);

  const toggleDrawer = () => {
    drawerX.value = withTiming(drawerOpen ? -260 : 0, { duration: 300 });
    setDrawerOpen(!drawerOpen);
  };

  const animatedDrawerStyle = useAnimatedStyle(() => ({
    left: drawerX.value,
  }));

  const [store] = useState({
    name: "متجر سوريا زون",
    description: "بيع الإلكترونيات والإكسسوارات بأسعار مناسبة.",
    logo: "https://via.placeholder.com/100",
    status: "نشط",
    totalProducts: 24,
    totalOrders: 132,
    totalRevenue: 57000000,
  });

  const [products] = useState([
    { id: "1", name: "سماعات بلوتوث", price: 80000, stock: 12, image: "https://via.placeholder.com/120", category: "إلكترونيات", description: "سماعات لاسلكية عالية الجودة" },
    { id: "2", name: "لابتوب HP", price: 3500000, stock: 5, image: "https://via.placeholder.com/120", category: "إلكترونيات", description: "حاسب محمول بمواصفات قوية" },
    { id: "3", name: "ساعة ذكية", price: 250000, stock: 7, image: "https://via.placeholder.com/120", category: "إكسسوارات", description: "ساعة ذكية بتصميم أنيق" },
  ]);

  const salesValues = [1200, 1800, 2200, 1600, 2800, 3200, 2400];
  const salesColors = salesValues.map(() => getRandomColor());

  const salesData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{ data: salesValues, colors: salesColors.map((c) => () => c) }],
  };

  const categoriesData = [
    { name: "Electronics", population: 45 },
    { name: "Accessories", population: 25 },
    { name: "Home", population: 15 },
    { name: "Clothes", population: 10 },
    { name: "Other", population: 5 },
  ].map((item) => ({
    ...item,
    color: getRandomColor(),
    legendFontColor: "#000",
    legendFontSize: 14,
  }));

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
    labelColor: () => "#000",
    propsForBackgroundLines: { stroke: "#e0e0e0" },
  };

  return (
    <View style={styles.screen}>
      {/* 💻 نسخة الكمبيوتر */}
      {screenWidth >= 1024 ? (
        <VendorsSideBar />
      ) : (
        <>
          {/* زر المنيو */}
          <TouchableOpacity
            style={styles.menuBtn}
            onPress={toggleDrawer}
          >
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Overlay */}
          {drawerOpen && (
            <TouchableOpacity
              style={styles.overlay}
              onPress={toggleDrawer}
            />
          )}

          {/* القائمة الجانبية */}
          <Animated.View style={[styles.drawer, animatedDrawerStyle]}>
            <Text style={styles.drawerTitle}>القائمة</Text>
            {menuItems.map((item, idx) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.drawerItem,
                  idx === activeIndex && { backgroundColor: "#2563eb22" },
                ]}
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

      {/* المحتوى الرئيسي */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Image source={{ uri: store.logo }} style={styles.logo} />
          <View style={{ flex: 1 }}>
            <Text style={styles.storeName}>{store.name}</Text>
            <Text style={styles.storeDesc}>{store.description}</Text>
            <Text style={styles.storeStatus}>
              الحالة:{" "}
              <Text style={{ color: store.status === "نشط" ? "#2563eb" : "red" }}>
                {store.status}
              </Text>
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{store.totalProducts}</Text>
            <Text style={styles.statLabel}>المنتجات</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{store.totalOrders}</Text>
            <Text style={styles.statLabel}>الطلبات</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {store.totalRevenue.toLocaleString()} ل.س
            </Text>
            <Text style={styles.statLabel}>الإيرادات</Text>
          </View>
        </View>

        <View style={styles.chartsContainer}>
          <Text style={styles.sectionTitle}>المبيعات اليومية</Text>
          <BarChart
            data={salesData}
            width={screenWidth - 50}
            height={200}
            yAxisLabel="ل.س"
            yAxisSuffix=''
            chartConfig={chartConfig}
            fromZero
            withCustomBarColorFromData
            flatColor
            style={styles.chartBox}
          />

          <Text style={styles.sectionTitle}>توزيع الفئات</Text>
          <PieChart
            data={categoriesData}
            width={screenWidth - 30}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            style={styles.chartBox}
          />
        </View>

        <Text style={styles.sectionTitle}>منتجات المتجر</Text>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price.toLocaleString()} ل.س</Text>
              <Text style={styles.productStock}>المخزون: {item.stock}</Text>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/Vendor/Product/editProduct",
                    params: {
                      productId: item.id,
                      name: item.name,
                      price: String(item.price),
                      stock: String(item.stock),
                      category: item.category,
                      image: item.image,
                      description: item.description,
                    },
                  })
                }
                style={styles.editBtn}
              >
                <Text style={styles.editBtnText}>تعديل</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: screenWidth >= 1024 ? "row" : "column",
    backgroundColor: "#f5f5f5",
  },
  content: { flex: 1, backgroundColor: "#fff" },
  contentContainer: { padding: 15 },
  menuBtn: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 20,
    backgroundColor: "#2563eb",
    padding: 10,
    borderRadius: 8,
  },
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 9,
  },
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 250,
    height: "100%",
    backgroundColor: "#fff",
    paddingTop: 80,
    paddingHorizontal: 15,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 10,
    elevation: 10,
  },
  drawerTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, color: "#2563eb" },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  drawerText: { color: "#000", fontSize: 16, marginLeft: 10 },
  header: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#2563eb33",
  },
  logo: { width: 80, height: 80, borderRadius: 10, marginRight: 15 },
  storeName: { fontSize: 20, fontWeight: "bold", color: "#000" },
  storeDesc: { fontSize: 14, color: "#000", marginVertical: 4 },
  storeStatus: { fontSize: 14, color: "#000" },
  statsContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  statBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 15,
    alignItems: "center",
    padding: 10,
    marginHorizontal: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#2563eb33",
  },
  statNumber: { fontSize: 16, fontWeight: "bold", color: "#000" },
  statLabel: { fontSize: 13, color: "#000" },
  chartsContainer: { marginBottom: 20 },
  chartBox: {
    borderRadius: 15,
    backgroundColor: "#fff",
    elevation: 2,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#2563eb33",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
    textAlign: "center",
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    marginRight: 10,
    width: 160,
    elevation: 2,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2563eb33",
  },
  productImage: { width: 120, height: 120, borderRadius: 10 },
  productName: { fontSize: 15, fontWeight: "600", marginTop: 5, color: "#000" },
  productPrice: { color: "#000", fontWeight: "bold", marginTop: 3 },
  productStock: { color: "#000", fontSize: 13 },
  editBtn: {
    backgroundColor: "#2563eb",
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginTop: 6,
  },
  editBtnText: { color: "#fff", fontSize: 13, fontWeight: "bold" },
});

export default StorePage;

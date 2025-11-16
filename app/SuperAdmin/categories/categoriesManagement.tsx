import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Animated,
  Easing,
  useWindowDimensions,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import AnimatedReanimated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { router, useRouter } from "expo-router";

interface Category {
  id: string;
  name: string;
  productsCount: number;
  status: "نشط" | "غير نشط";
}

const MENU_ITEM_HEIGHT = 56;
const OPEN_WIDTH = 250;
const CLOSED_WIDTH = 80;

const menuItems = [
  { label: "لوحة التحكم", icon: "speedometer-outline", route: "SuperAdmin/dashboard" },
  { label: "إدارة المتاجر", icon: "storefront-outline", route: "SuperAdmin/stores/StoreManagement" },
  { label: "إدارة المستخدمين", icon: "people-outline", route: "SuperAdmin/users/UserManagement" },
  { label: "إدارة الطلبات", icon: "receipt-outline", route: "SuperAdmin/orders/ordersManagement" },
  { label: "إدارة المبيعات", icon: "bar-chart-outline", route: "SuperAdmin/sales/salesManagement" },
  { label: "الأقسام", icon: "grid-outline", route: "SuperAdmin/categories/categoriesManagement" },
  { label: "التقارير", icon: "alert-circle-outline", route: "SuperAdmin/reports" },
  { label: "إعدادات النظام", icon: "settings-outline", route: "SuperAdmin/settings/systemSettings" },
];

const MOCK_CATEGORIES: Category[] = [
  { id: "C001", name: "إلكترونيات", productsCount: 120, status: "نشط" },
  { id: "C002", name: "ملابس", productsCount: 80, status: "نشط" },
  { id: "C003", name: "أحذية", productsCount: 40, status: "غير نشط" },
  { id: "C004", name: "إكسسوارات", productsCount: 60, status: "نشط" },
  { id: "C005", name: "منزلية", productsCount: 30, status: "غير نشط" },
];

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
};

const CategoriesManagement: React.FC = () => {
  const { width } = useWindowDimensions();
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [activeIndex, setActiveIndex] = useState(5); // الأقسام
  const [open, setOpen] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);

  const isMobile = width < 830;
  const isDesktop = width >= 1024;
  const chartWidth = isDesktop ? width * 0.45 : width - 40;
  const router = useRouter(); // استخدام الـ router
  const updateCategory = (updatedCategory: Category) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
    );
  };

  // Sidebar animations
  const indicatorY = useRef(new Animated.Value(activeIndex * MENU_ITEM_HEIGHT)).current;
  const widthAnim = useRef(new Animated.Value(OPEN_WIDTH)).current;
  const drawerX = useSharedValue(-260);

  useEffect(() => {
    Animated.timing(indicatorY, {
      toValue: activeIndex * MENU_ITEM_HEIGHT,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    Animated.timing(widthAnim, {
      toValue: open ? OPEN_WIDTH : CLOSED_WIDTH,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [activeIndex, open]);

  const animatedDrawerStyle = useAnimatedStyle(() => ({ left: drawerX.value }));

  const switchPage = (route: string, idx: number) => {
    setActiveIndex(idx);
    if (route) router.replace(route as any);
    if (isMobile) {
      drawerX.value = withTiming(-260, { duration: 300 });
      setOpenDrawer(false);
    }
  };

  const toggleDrawer = () => {
    drawerX.value = withTiming(openDrawer ? -260 : 0, { duration: 300 });
    setOpenDrawer(!openDrawer);
  };

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
      {!isMobile ? (
        <Animated.View style={[styles.sidebar, { width: widthAnim }]}>
          <View style={styles.headerSidebar}>
            <TouchableOpacity onPress={() => setOpen((o) => !o)} style={styles.burgerBtn}>
              <Ionicons name="menu" size={24} color="#f9f9f9" />
            </TouchableOpacity>
            {open && <Text style={styles.sidebarTitle}>سوريا زون</Text>}
          </View>
          <View style={styles.menu}>
            <Animated.View pointerEvents="none" style={[styles.indicator, { transform: [{ translateY: indicatorY }] }]} />
            {menuItems.map((item, idx) => {
              const active = idx === activeIndex;
              return (
                <TouchableOpacity
                  key={item.label}
                  onPress={() => switchPage(item.route, idx)}
                  style={[styles.item, active && styles.itemActive]}
                >
                  <Ionicons name={item.icon as any} size={22} color="#f9f9f9" />
                  {open && <Text style={[styles.itemText, active && styles.itemTextActive]}>{item.label}</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      ) : (
        <>
          <TouchableOpacity style={styles.menuBtn} onPress={toggleDrawer}>
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>
          {openDrawer && <TouchableOpacity style={styles.overlay} onPress={toggleDrawer} activeOpacity={1} />}
          <AnimatedReanimated.View style={[styles.drawer, animatedDrawerStyle]}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>القائمة</Text>
              <TouchableOpacity onPress={toggleDrawer}>
                <Ionicons name="close" size={24} color="#2563eb" />
              </TouchableOpacity>
            </View>
            {menuItems.map((item, idx) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => switchPage(item.route, idx)}
                style={[styles.drawerItem, activeIndex === idx && styles.drawerItemActive]}
              >
                <Ionicons name={item.icon as any} size={20} color="#2563eb" />
                <Text style={styles.drawerItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </AnimatedReanimated.View>
        </>
      )}

      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>إدارة التصنيفات</Text>
            <Text style={styles.subtitle}>تحكم بالتصنيفات المعروضة في النظام</Text>
          </View>

          <TouchableOpacity onPress={() => router.replace('../SuperAdmin/categories/categoriesPage')} style={styles.addBtn}>
            <Ionicons name="add-circle-outline" size={22} color="#fff" />
            <Text style={styles.addBtnText}>إضافة تصنيف جديد</Text>
          </TouchableOpacity>

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
                    <TouchableOpacity onPress={() =>
                router.push({
                  pathname:'/SuperAdmin/categories/editCategoryPage',
                  params: { category: JSON.stringify(item) }, // نرسل البيانات كـ string
                })
              } style={styles.editBtn}>
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

  // Sidebar Desktop
  sidebar: {
    position: "relative",
    top: 24,
    left: 24,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#2563eb",
    height: "100%",
    alignSelf: "stretch",
    zIndex: 2,
  },
  headerSidebar: { height: 72, flexDirection: "row", alignItems: "center", paddingRight: 20 },
  burgerBtn: { width: 70, height: "100%", alignItems: "center", justifyContent: "center" },
  sidebarTitle: { color: "#fff", fontWeight: "700", fontSize: 18, marginLeft: 8 },
  menu: { flex: 1, paddingTop: 10 },
  indicator: {
    position: "absolute",
    left: 0,
    width: 4,
    height: MENU_ITEM_HEIGHT,
    backgroundColor: "#f9f9f9",
    borderRadius: 2,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    height: MENU_ITEM_HEIGHT,
    paddingHorizontal: 16,
    marginVertical: 2,
    borderRadius: 8,
  },
  itemActive: { backgroundColor: "rgba(255,255,255,0.2)" },
  itemText: { color: "#f9f9f9", marginLeft: 12 },
  itemTextActive: { fontWeight: "700" },

  // Drawer Mobile
  menuBtn: {
    position: "absolute",
    top: 40,
    left: 16,
    zIndex: 5,
    backgroundColor: "#2563eb",
    padding: 10,
    borderRadius: 10,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    zIndex: 4,
  },
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 260,
    backgroundColor: "#fff",
    zIndex: 5,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  drawerHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  drawerTitle: { fontSize: 18, fontWeight: "700", color: "#2563eb" },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    height: MENU_ITEM_HEIGHT,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  drawerItemActive: { backgroundColor: "rgba(37, 99, 235, 0.2)" },
  drawerItemText: { marginLeft: 12, fontSize: 16, color: "#2563eb" },
});

export default CategoriesManagement;

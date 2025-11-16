import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  useWindowDimensions,
  Pressable,
  Image,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import AnimatedReanimated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { router } from "expo-router";

// ===== Types =====
type Range = "يومي" | "أسبوعي" | "شهري";

interface Store {
  id: string;
  name: string;
  owner: string;
  sales: number;
  orders: number;
}

interface Order {
  id: string;
  store: string;
  customer: string;
  total: number;
  date: string;
}

// ===== Mock Data =====
const MOCK_STORES: Store[] = [
  { id: "ST001", name: "سوريا زون", owner: "أحمد علي", sales: 3200000, orders: 142 },
  { id: "ST002", name: "الكترونيات المستقبل", owner: "رنا حسن", sales: 2750000, orders: 120 },
  { id: "ST003", name: "متجر الأزياء", owner: "سارة كمال", sales: 1980000, orders: 90 },
];

const MOCK_ORDERS: Order[] = [
  { id: "O001", store: "سوريا زون", customer: "محمد خليل", total: 180000, date: "2025-11-09" },
  { id: "O002", store: "الكترونيات المستقبل", customer: "ليلى ديب", total: 275000, date: "2025-11-09" },
  { id: "O003", store: "متجر الأزياء", customer: "نور حسان", total: 130000, date: "2025-11-08" },
  { id: "O004", store: "سوريا زون", customer: "خالد سعيد", total: 450000, date: "2025-11-08" },
  { id: "O005", store: "الكترونيات المستقبل", customer: "منى علي", total: 320000, date: "2025-11-07" },
];

const CHARTS = {
  يومي: { labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], values: [18, 24, 32, 28, 25, 34, 40] },
  أسبوعي: { labels: ["W1", "W2", "W3", "W4"], values: [180, 240, 220, 270] },
  شهري: {
    labels: ["ينا", "فبر", "مار", "أب", "ماي", "يون", "يول", "أغس", "سبت", "أكت", "نوف", "ديس"],
    values: [450, 520, 610, 580, 720, 830, 910, 960, 870, 940, 1000, 1120],
  },
};

const PIE_SECTIONS = [
  { name: "إلكترونيات", value: 45 },
  { name: "ملابس", value: 25 },
  { name: "إكسسوارات", value: 15 },
  { name: "منزلية", value: 10 },
  { name: "أخرى", value: 5 },
];

// ===== Sidebar Config =====
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

// ===== Utility Functions =====
const currency = (v: number) => v.toLocaleString() + " ل.س";
const randomColor = () => "#" + Math.floor(Math.random() * 16777215).toString(16);

// ===== Main Component =====
const SuperAdminDashboard: React.FC = () => {
  const { width } = useWindowDimensions();
  const [range, setRange] = useState<Range>("شهري");
  const [openSidebar, setOpenSidebar] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);

  const isDesktop = width >= 1024;
  const chartsWidth = isDesktop ? width * 0.45 : width - 40;
  const isMobile = width < 830;

  // Sidebar Animations
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
      toValue: openSidebar ? OPEN_WIDTH : CLOSED_WIDTH,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [activeIndex, openSidebar]);

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

  // ===== Dashboard Stats =====
  const totalStores = MOCK_STORES.length;
  const totalOrders = MOCK_ORDERS.length;
  const totalRevenue = MOCK_STORES.reduce((a, b) => a + b.sales, 0);
  const avgOrders = Math.round(totalOrders / totalStores);

  const barData = useMemo(() => {
    const d = CHARTS[range];
    const colors = d.values.map(() => randomColor());
    return { labels: d.labels, values: d.values, colors };
  }, [range]);

  const pieData = PIE_SECTIONS.map((p) => ({
    name: p.name,
    population: p.value,
    color: randomColor(),
    legendFontColor: "#000",
    legendFontSize: 12,
  }));

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
    labelColor: () => "#000",
    propsForBackgroundLines: { stroke: "#f0f0f0" },
  };

  return (
    <View style={{ flex: 1, flexDirection: isMobile ? "column" : "row" }}>
      {/* ===== Sidebar / Drawer ===== */}
      {!isMobile ? (
        <Animated.View style={[styles.sidebar, { width: widthAnim }]}>
          <View style={styles.headerSidebar}>
            <Pressable onPress={() => setOpenSidebar((o) => !o)} style={styles.burgerBtn}>
              <Ionicons name="menu" size={24} color="#f9f9f9" />
            </Pressable>
            {openSidebar && <Text style={styles.sidebarTitle}>سوريا زون</Text>}
          </View>
          <View style={styles.menu}>
            <Animated.View pointerEvents="none" style={[styles.indicator, { transform: [{ translateY: indicatorY }] }]} />
            {menuItems.map((item, idx) => {
              const active = idx === activeIndex;
              return (
                <Pressable
                  key={item.label}
                  onPress={() => switchPage(item.route, idx)}
                  style={({ pressed }) => [styles.item, active && styles.itemActive, pressed && styles.itemPressed]}
                >
                  <Ionicons name={item.icon as any} size={22} color="#f9f9f9" />
                  {openSidebar && <Text style={[styles.itemText, active && styles.itemTextActive]}>{item.label}</Text>}
                </Pressable>
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
              <Pressable onPress={toggleDrawer}>
                <Ionicons name="close" size={24} color="#2563eb" />
              </Pressable>
            </View>
            {menuItems.map((item, idx) => (
              <Pressable
                key={item.label}
                onPress={() => switchPage(item.route, idx)}
                style={[styles.drawerItem, activeIndex === idx && styles.drawerItemActive]}
              >
                <Ionicons name={item.icon as any} size={20} color="#2563eb" />
                <Text style={styles.drawerItemText}>{item.label}</Text>
              </Pressable>
            ))}
          </AnimatedReanimated.View>
        </>
      )}

      {/* ===== Main Dashboard ===== */}
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>لوحة التحكم العامة</Text>
            <Text style={styles.subtitle}>نظرة شاملة على أداء المنصة</Text>
          </View>

          {/* Range Buttons */}
          <View style={styles.rangeContainer}>
            {(["يومي", "أسبوعي", "شهري"] as Range[]).map((r) => (
              <TouchableOpacity
                key={r}
                style={[styles.rangeBtn, range === r && styles.rangeBtnActive]}
                onPress={() => setRange(r)}
              >
                <Text style={[styles.rangeText, range === r && styles.rangeTextActive]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Summary Cards */}
          <View style={[styles.summaryRow, isDesktop && { justifyContent: "space-between" }]}>
            <View style={[styles.summaryCard, isDesktop && { width: "23%" }]}>
              <Ionicons name="storefront-outline" size={22} color="#2563eb" />
              <Text style={styles.cardLabel}>عدد المتاجر</Text>
              <Text style={styles.cardValue}>{totalStores}</Text>
            </View>
            <View style={[styles.summaryCard, isDesktop && { width: "23%" }]}>
              <Ionicons name="cart-outline" size={22} color="#2563eb" />
              <Text style={styles.cardLabel}>عدد الطلبات</Text>
              <Text style={styles.cardValue}>{totalOrders}</Text>
            </View>
            <View style={[styles.summaryCard, isDesktop && { width: "23%" }]}>
              <Ionicons name="cash-outline" size={22} color="#2563eb" />
              <Text style={styles.cardLabel}>الإيرادات الكلية</Text>
              <Text style={styles.cardValue}>{currency(totalRevenue)}</Text>
            </View>
            <View style={[styles.summaryCard, isDesktop && { width: "23%" }]}>
              <Ionicons name="stats-chart-outline" size={22} color="#2563eb" />
              <Text style={styles.cardLabel}>متوسط الطلبات/متجر</Text>
              <Text style={styles.cardValue}>{avgOrders}</Text>
            </View>
          </View>

          {/* Charts */}
          <View style={[styles.chartsArea, isDesktop && styles.chartsAreaDesktop]}>
            <View style={[styles.chartCard, isDesktop ? { width: chartsWidth } : { width: "100%" }]}>
              <Text style={styles.chartTitle}>{range} — إجمالي الطلبات</Text>
              <BarChart
                data={{
                  labels: barData.labels,
                  datasets: [{ data: barData.values, colors: barData.colors.map((c) => () => c) }],
                }}
                width={isDesktop ? chartsWidth - 20 : chartsWidth}
                height={220}
                yAxisSuffix=""
                yAxisLabel=""
                chartConfig={chartConfig}
                fromZero
                showBarTops={false}
                withCustomBarColorFromData
                flatColor
                style={styles.chartStyle}
              />
            </View>

            <View style={[styles.chartCard, isDesktop ? { width: chartsWidth } : { width: "100%" }]}>
              <Text style={styles.chartTitle}>توزيع الفئات الأكثر نشاطاً</Text>
              <PieChart
                data={pieData as any}
                width={isDesktop ? chartsWidth - 20 : chartsWidth}
                height={220}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
                style={styles.chartStyle}
              />
            </View>
          </View>

          {/* Tables */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🛍️ أحدث المتاجر</Text>
            {MOCK_STORES.map((store) => (
              <View key={store.id} style={styles.row}>
                <Text style={styles.col1}>{store.name}</Text>
                <Text style={styles.col2}>{store.owner}</Text>
                <Text style={styles.col3}>{store.orders} طلب</Text>
                <Text style={styles.col4}>{currency(store.sales)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📦 أحدث الطلبات</Text>
            <FlatList
              data={MOCK_ORDERS}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <Text style={styles.col1}>#{item.id}</Text>
                  <Text style={styles.col2}>{item.store}</Text>
                  <Text style={styles.col3}>{item.customer}</Text>
                  <Text style={styles.col4}>{currency(item.total)}</Text>
                </View>
              )}
              scrollEnabled={false}
            />
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

// ===== Styles (merged Sidebar style from SalesManagement) =====
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f7fb" },
  container: { padding: 16 },
  header: { marginBottom: 12 },
  title: { fontSize: 22, fontWeight: "800", color: "#000" },
  subtitle: { color: "#666" },
  rangeContainer: { flexDirection: "row", marginBottom: 12 },
  rangeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e6eefc",
    marginRight: 8,
    backgroundColor: "#fff",
  },
  rangeBtnActive: { backgroundColor: "#2563eb" },
  rangeText: { color: "#000" },
  rangeTextActive: { color: "#fff" },
  summaryRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 18 },
  summaryCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e6eefc",
    marginBottom: 8,
  },
  cardLabel: { color: "#666", fontSize: 13 },
  cardValue: { color: "#2563eb", fontSize: 18, fontWeight: "800" },
  chartsArea: { marginBottom: 18 },
  chartsAreaDesktop: { flexDirection: "row", justifyContent: "space-between" },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e6eefc",
  },
  itemPressed: {
    opacity: 0.6,
  },
  chartTitle: { fontWeight: "700", fontSize: 16, marginBottom: 6 },
  chartStyle: { borderRadius: 12 },
  section: { marginTop: 6 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e6eefc",
    padding: 8,
    borderRadius: 10,
    marginBottom: 6,
  },
  col1: { flex: 2, color: "#000" },
  col2: { flex: 2, color: "#000" },
  col3: { flex: 1, color: "#000" },
  col4: { flex: 1, color: "#2563eb", fontWeight: "700" },

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

export default SuperAdminDashboard;

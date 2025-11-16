



import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Pressable,
  TextInput,
  Dimensions,
  SafeAreaView,
  Animated,
  Easing,
} from "react-native";
import AnimatedReanimated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { BarChart, PieChart } from "react-native-chart-kit";

type Range = "يومي" | "أسبوعي" | "شهري";

interface Order {
  id: string;
  store: string;
  customer: string;
  status: "مكتمل" | "قيد التنفيذ" | "ملغى";
  total: number;
  date: string;
}

const currency = (v: number) => v.toLocaleString() + " ل.س";
const randomColor = () =>
  "#" + Math.floor(Math.random() * 16777215).toString(16);

const MENU_ITEM_HEIGHT = 56;
const OPEN_WIDTH = 250;
const CLOSED_WIDTH = 80;

const menuItems = [
  { label: "Dashboard", icon: "speedometer-outline", route: "SuperAdmin/dashboard" },
  { label: "Stores", icon: "storefront-outline", route: "SuperAdmin/stores/StoreManagement" },
  { label: "Users", icon: "people-outline", route: "SuperAdmin/users/UserManagement" },
  { label: "Orders", icon: "receipt-outline", route: "SuperAdmin/orders/ordersManagement" },
  { label: "Sales", icon: "bar-chart-outline", route: "SuperAdmin/sales/salesManagement" },
  { label: "Categories", icon: "grid-outline", route: "SuperAdmin/categories/categoriesManagement" },
  { label: "Reports", icon: "alert-circle-outline", route: "SuperAdmin/reports" },
  { label: "Settings", icon: "settings-outline", route: "SuperAdmin/settings/systemSettings" },
];

const MOCK_ORDERS: Order[] = [
  { id: "O001", store: "سوريا زون", customer: "محمد علي", status: "مكتمل", total: 180000, date: "2025-11-09" },
  { id: "O002", store: "الكترونيات المستقبل", customer: "رنا كمال", status: "قيد التنفيذ", total: 250000, date: "2025-11-09" },
  { id: "O003", store: "متجر الأزياء", customer: "نور خليل", status: "ملغى", total: 90000, date: "2025-11-08" },
  { id: "O004", store: "سوريا زون", customer: "حسن ديب", status: "مكتمل", total: 350000, date: "2025-11-08" },
  { id: "O005", store: "الكترونيات المستقبل", customer: "مها ناصر", status: "قيد التنفيذ", total: 210000, date: "2025-11-07" },
  { id: "O006", store: "متجر الأزياء", customer: "إياد عبدو", status: "مكتمل", total: 125000, date: "2025-11-06" },
];

export default function OrdersManagementPage() {
  const { width } = Dimensions.get("window");
  const isMobile = width < 830;
  const isDesktop = width >= 1024;

  // Sidebar state
  const [open, setOpen] = useState(true);
  const [activeIndex, setActiveIndex] = useState(3); // Orders by default
  const [openDrawer, setOpenDrawer] = useState(false);
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
  }, [activeIndex]);

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: open ? OPEN_WIDTH : CLOSED_WIDTH,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [open]);
  const chartsWidth = isDesktop ? width * 0.45 : width - 40;

  const animatedDrawerStyle = useAnimatedStyle(() => ({ left: drawerX.value }));

  const switchpage = (route: string, idx: number) => {
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
  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
    labelColor: () => "#000",
    propsForBackgroundLines: { stroke: "#f0f0f0" },
  };
  const totalOrders = MOCK_ORDERS.length;
  const completed = MOCK_ORDERS.filter((o) => o.status === "مكتمل").length;
  const inProgress = MOCK_ORDERS.filter((o) => o.status === "قيد التنفيذ").length;
  const cancelled = MOCK_ORDERS.filter((o) => o.status === "ملغى").length;
  const pieData = [
    { name: "مكتمل", population: completed, color: "#22c55e", legendFontColor: "#000", legendFontSize: 12 },
    { name: "قيد التنفيذ", population: inProgress, color: "#2563eb", legendFontColor: "#000", legendFontSize: 12 },
    { name: "ملغى", population: cancelled, color: "#ef4444", legendFontColor: "#000", legendFontSize: 12 },
  ];
  // Chart & range state
  const [range, setRange] = useState<Range>("شهري");
  const CHARTS = {
    يومي: { labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], values: [12, 18, 22, 16, 25, 28, 20] },
    أسبوعي: { labels: ["W1", "W2", "W3", "W4"], values: [60, 72, 54, 80] },
    شهري: {
      labels: ["ينا", "فبر", "مار", "أب", "ماي", "يون", "يول", "أغس", "سبت", "أكت", "نوف", "ديس"],
      values: [120, 135, 160, 155, 180, 190, 200, 220, 210, 230, 240, 250],
    },
  };
  const barData = useMemo(() => {
    const d = CHARTS[range];
    return { labels: d.labels, values: d.values, colors: d.values.map(() => randomColor()) };
  }, [range]);

  // Orders stats


  return (
    <View style={{ flex: 1, flexDirection: isMobile ? "column" : "row" }}>
      {/* Sidebar */}
      {!isMobile && (
        <Animated.View style={[styles.sidebar, { width: widthAnim }]}>
          <View style={styles.headerSidebar}>
            <Pressable onPress={() => setOpen((o) => !o)} style={styles.burgerBtn}>
              <Ionicons name="menu" size={24} color="#f9f9f9" />
            </Pressable>
          </View>
          <View style={styles.menu}>
            <Animated.View pointerEvents="none" style={[styles.indicator, { transform: [{ translateY: indicatorY }] }]} />
            {menuItems.map((item, idx) => {
              const active = idx === activeIndex;
              return (
                <Pressable
                  key={item.label}
                  onPress={() => switchpage(item.route, idx)}
                  style={({ pressed }) => [styles.item, active && styles.itemActive, pressed && styles.itemPressed]}
                >
                  <Ionicons name={item.icon as any} size={22} color="#f9f9f9" />
                  {open && <Text style={[styles.itemText, active && styles.itemTextActive]}>{item.label}</Text>}
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      )}

      {/* Drawer mobile */}
      {isMobile && (
        <>
          <TouchableOpacity style={styles.menuBtn} onPress={toggleDrawer}>
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>
          {openDrawer && <TouchableOpacity style={styles.overlay} onPress={toggleDrawer} activeOpacity={1} />}
          <AnimatedReanimated.View style={[styles.drawer, animatedDrawerStyle]}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Menu</Text>
              <Pressable onPress={toggleDrawer}>
                <Ionicons name="close" size={24} color="#2563eb" />
              </Pressable>
            </View>
            {menuItems.map((item, idx) => (
              <Pressable
                key={item.label}
                onPress={() => switchpage(item.route, idx)}
                style={[styles.drawerItem, activeIndex === idx && styles.drawerItemActive]}
              >
                <Ionicons name={item.icon as any} size={20} color="#2563eb" />
                <Text style={styles.drawerItemText}>{item.label}</Text>
              </Pressable>
            ))}
          </AnimatedReanimated.View>
        </>
      )}

      {/* Main Content */}
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.containerContent}>
          <Text style={styles.title}>📦 إدارة الطلبات</Text>

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
                    {/* الرسم البياني */}
                    <View style={[styles.chartsArea, isDesktop && styles.chartsAreaDesktop]}>
            <View style={[styles.chartCard, isDesktop ? { width: chartsWidth } : { width: "100%" }]}>
              <Text style={styles.chartTitle}>{range} — عدد الطلبات</Text>
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
              <Text style={styles.chartTitle}>توزيع حالات الطلبات</Text>
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


          {/* Summary Cards */}
          <View style={[styles.summaryRow, isDesktop && { justifyContent: "space-between" }]}>
            <View style={[styles.summaryCard, isDesktop && { width: "23%" }]}>
              <Ionicons name="document-text-outline" size={22} color="#2563eb" />
              <Text style={styles.cardLabel}>إجمالي الطلبات</Text>
              <Text style={styles.cardValue}>{totalOrders}</Text>
            </View>
            <View style={[styles.summaryCard, isDesktop && { width: "23%" }]}>
              <Ionicons name="checkmark-done-outline" size={22} color="#22c55e" />
              <Text style={styles.cardLabel}>المكتملة</Text>
              <Text style={[styles.cardValue, { color: "#22c55e" }]}>{completed}</Text>
            </View>
            <View style={[styles.summaryCard, isDesktop && { width: "23%" }]}>
              <Ionicons name="time-outline" size={22} color="#2563eb" />
              <Text style={styles.cardLabel}>قيد التنفيذ</Text>
              <Text style={[styles.cardValue, { color: "#2563eb" }]}>{inProgress}</Text>
            </View>
            <View style={[styles.summaryCard, isDesktop && { width: "23%" }]}>
              <Ionicons name="close-circle-outline" size={22} color="#ef4444" />
              <Text style={styles.cardLabel}>الملغاة</Text>
              <Text style={[styles.cardValue, { color: "#ef4444" }]}>{cancelled}</Text>
            </View>
          </View>

          {/* Orders Table */}
          <View style={styles.section}>
            <FlatList
              data={MOCK_ORDERS}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <Text style={styles.col1}>#{item.id}</Text>
                  <Text style={styles.col2}>{item.store}</Text>
                  <Text style={styles.col3}>{item.customer}</Text>
                  <Text
                    style={[
                      styles.colStatus,
                      item.status === "مكتمل"
                        ? { color: "#22c55e" }
                        : item.status === "ملغى"
                        ? { color: "#ef4444" }
                        : { color: "#2563eb" },
                    ]}
                  >
                    {item.status}
                  </Text>
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
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f7fb" },
  containerContent: { padding: 16 },
  // Sidebar
  sidebar: { position: "relative", top: 24, left: 24, borderRadius: 16, overflow: "hidden", backgroundColor: "#2563eb", height: "100%", alignSelf: "stretch", zIndex: 2 },
  headerSidebar: { height: 72, flexDirection: "row", alignItems: "center", paddingRight: 20 },
  burgerBtn: { width: 70, height: "100%", alignItems: "center", justifyContent: "center" },
  menu: { flex: 1 },
  indicator: { position: "absolute", left: 0, top: 0, height: MENU_ITEM_HEIGHT, width: 5, backgroundColor: "#6199f7", borderTopRightRadius: 4, borderBottomRightRadius: 4 },
  item: { height: MENU_ITEM_HEIGHT, paddingHorizontal: 22, flexDirection: "row", alignItems: "center", gap: 16, opacity: 0.6 },
  itemPressed: { backgroundColor: "rgba(0,0,0,0.2)" },
  itemActive: { backgroundColor: "rgba(0,0,0,0.08)", opacity: 1 },
  itemText: { color: "#f9f9f9", fontSize: 16 },
  itemTextActive: { fontWeight: "600" },
  menuBtn: { position: "absolute", top: 40, left: 20, zIndex: 20, backgroundColor: "#2563eb", padding: 10, borderRadius: 8 },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 9 },
  drawer: { position: "absolute", top: 0, left: 0, width: 250, height: "100%", backgroundColor: "#fff", paddingTop: 80, paddingHorizontal: 15, borderTopRightRadius: 20, borderBottomRightRadius: 20, zIndex: 10, elevation: 10 },
  drawerHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  drawerTitle: { fontSize: 18, fontWeight: "bold", color: "#2563eb" },
  drawerItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderRadius: 10, marginBottom: 8 },
  drawerItemActive: { backgroundColor: "#2563eb22" },
  drawerItemText: { color: "#000", fontSize: 16, marginLeft: 10 },
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
  chartTitle: { fontWeight: "700", fontSize: 16, marginBottom: 6 },
  chartStyle: { borderRadius: 12 },
  // Content
  title: { fontSize: 22, fontWeight: "800", color: "#000", marginBottom: 12 },
  rangeContainer: { flexDirection: "row", marginBottom: 12 },
  rangeBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: "#e6eefc", marginRight: 8, backgroundColor: "#fff" },
  rangeBtnActive: { backgroundColor: "#2563eb" },
  rangeText: { color: "#000" },
  rangeTextActive: { color: "#fff" },
  summaryRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 18 },
  summaryCard: { backgroundColor: "#fff", padding: 14, borderRadius: 12, borderWidth: 1, borderColor: "#e6eefc", marginBottom: 8 },
  cardLabel: { color: "#666", fontSize: 13 },
  cardValue: { color: "#2563eb", fontSize: 18, fontWeight: "800" },

  section: { marginTop: 6 },
  row: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#fff", borderWidth: 1, borderColor: "#e6eefc", borderRadius: 8, padding: 10, marginBottom: 6 },
  col1: { flex: 1, color: "#000", fontWeight: "600" },
  col2: { flex: 1, color: "#000" },
  col3: { flex: 1, color: "#000" },
  colStatus: { flex: 1, fontWeight: "700", textAlign: "center" },
  col4: { flex: 1, color: "#000", textAlign: "right", fontWeight: "700" },
});
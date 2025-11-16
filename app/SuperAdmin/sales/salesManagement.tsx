import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Dimensions,
  Animated,
  Easing,
  useWindowDimensions,
} from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import AnimatedReanimated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { router } from "expo-router";

type Range = "يومي" | "أسبوعي" | "شهري";

interface Sale {
  id: string;
  store: string;
  total: number;
  date: string;
  category: string;
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

const MOCK_SALES: Sale[] = [
  { id: "S001", store: "سوريا زون", total: 180000, date: "2025-11-09", category: "إلكترونيات" },
  { id: "S002", store: "الكترونيات المستقبل", total: 250000, date: "2025-11-09", category: "إلكترونيات" },
  { id: "S003", store: "متجر الأزياء", total: 120000, date: "2025-11-08", category: "ملابس" },
  { id: "S004", store: "متجر الأحذية", total: 90000, date: "2025-11-08", category: "أحذية" },
  { id: "S005", store: "سوريا زون", total: 220000, date: "2025-11-07", category: "إلكترونيات" },
  { id: "S006", store: "اكسسواراتي", total: 145000, date: "2025-11-06", category: "إكسسوارات" },
];

const CHARTS = {
  يومي: { labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], values: [120, 150, 180, 200, 170, 250, 300] },
  أسبوعي: { labels: ["W1", "W2", "W3", "W4"], values: [600, 750, 900, 1050] },
  شهري: {
    labels: ["ينا", "فبر", "مار", "أب", "ماي", "يون", "يول", "أغس", "سبت", "أكت", "نوف", "ديس"],
    values: [1000, 1100, 1300, 1200, 1500, 1600, 1700, 1550, 1650, 1800, 1900, 2000],
  },
};

const currency = (v: number) => v.toLocaleString() + " ل.س";
const randomColor = () => "#" + Math.floor(Math.random() * 16777215).toString(16);

const SalesManagement: React.FC = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 830;
  const isDesktop = width >= 1024;
  const chartsWidth = isDesktop ? width * 0.45 : width - 40;

  const [range, setRange] = useState<Range>("شهري");
  const [activeIndex, setActiveIndex] = useState(4); // إدارة المبيعات
  const [open, setOpen] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);

  const indicatorY = useRef(new Animated.Value(activeIndex * MENU_ITEM_HEIGHT)).current;
  const widthAnim = useRef(new Animated.Value(OPEN_WIDTH)).current;
  const drawerX = useSharedValue(-260);

  // الحسابات
  const totalSales = MOCK_SALES.length;
  const totalRevenue = MOCK_SALES.reduce((a, b) => a + b.total, 0);
  const avgValue = Math.round(totalRevenue / Math.max(1, totalSales));
  const storesCount = new Set(MOCK_SALES.map((s) => s.store)).size;

  const barData = useMemo(() => {
    const d = CHARTS[range];
    const colors = d.values.map(() => randomColor());
    return { labels: d.labels, values: d.values, colors };
  }, [range]);

  const categories = Array.from(
    MOCK_SALES.reduce((map, s) => map.set(s.category, (map.get(s.category) || 0) + 1), new Map())
  );
  const pieData = categories.map(([name, count]) => ({
    name,
    population: count,
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

  // انيميشن السايدبار
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

  return (
    <View style={{ flex: 1, flexDirection: isMobile ? "column" : "row" }}>
      {!isMobile ? (
        // Sidebar Desktop
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
        // Drawer Mobile
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

      {/* Main Content */}
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>إدارة المبيعات</Text>
            <Text style={styles.subtitle}>تحليل شامل للمبيعات عبر جميع المتاجر</Text>
          </View>

          {/* المدى الزمني */}
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

          {/* الملخص */}
          <View style={[styles.summaryRow, isDesktop && { justifyContent: "space-between" }]}>
            <View style={[styles.summaryCard, isDesktop && { width: "23%" }]}>
              <Ionicons name="cart-outline" size={22} color="#2563eb" />
              <Text style={styles.cardLabel}>عدد المبيعات</Text>
              <Text style={styles.cardValue}>{totalSales}</Text>
            </View>
            <View style={[styles.summaryCard, isDesktop && { width: "23%" }]}>
              <Ionicons name="cash-outline" size={22} color="#22c55e" />
              <Text style={styles.cardLabel}>إجمالي الإيرادات</Text>
              <Text style={[styles.cardValue, { color: "#22c55e" }]}>{currency(totalRevenue)}</Text>
            </View>
            <View style={[styles.summaryCard, isDesktop && { width: "23%" }]}>
              <Ionicons name="stats-chart-outline" size={22} color="#2563eb" />
              <Text style={styles.cardLabel}>متوسط الطلب</Text>
              <Text style={styles.cardValue}>{currency(avgValue)}</Text>
            </View>
            <View style={[styles.summaryCard, isDesktop && { width: "23%" }]}>
              <Ionicons name="storefront-outline" size={22} color="#f59e0b" />
              <Text style={styles.cardLabel}>عدد المتاجر</Text>
              <Text style={[styles.cardValue, { color: "#f59e0b" }]}>{storesCount}</Text>
            </View>
          </View>

          {/* الرسوم */}
          <View style={[styles.chartsArea, isDesktop && styles.chartsAreaDesktop]}>
            <View style={[styles.chartCard, isDesktop ? { width: chartsWidth } : { width: "100%" }]}>
              <Text style={styles.chartTitle}>{range} — المبيعات</Text>
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
                withCustomBarColorFromData
                flatColor
                style={styles.chartStyle}
              />
            </View>

            <View style={[styles.chartCard, isDesktop ? { width: chartsWidth } : { width: "100%" }]}>
              <Text style={styles.chartTitle}>توزيع المبيعات حسب الفئات</Text>
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

          {/* الجدول */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🧾 آخر المبيعات</Text>
            <FlatList
              data={MOCK_SALES}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <Text style={styles.col1}>#{item.id}</Text>
                  <Text style={styles.col2}>{item.store}</Text>
                  <Text style={styles.col3}>{item.category}</Text>
                  <Text style={styles.col4}>{currency(item.total)}</Text>
                  <Text style={styles.col5}>{item.date}</Text>
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

// Styles (دمج styles من الكودين)
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
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },
  col1: { flex: 1, color: "#000", fontWeight: "600" },
  col2: { flex: 1, color: "#000" },
  col3: { flex: 1, color: "#000" },
  col4: { flex: 1, color: "#000", textAlign: "right", fontWeight: "700" },
  col5: { flex: 1, color: "#666", textAlign: "right" },

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

export default SalesManagement;


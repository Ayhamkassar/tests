import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import Sidebar from "../dashboard/sidebar";

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

const currency = (v: number) => v.toLocaleString() + " ل.س";
const randomColor = () =>
  "#" + Math.floor(Math.random() * 16777215).toString(16);

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

const SuperAdminDashboard: React.FC = () => {
  const { width } = useWindowDimensions();
  const [range, setRange] = useState<Range>("شهري");

  const isMobile = width < 830;
  const isDesktop = width >= 1024;
  const chartsWidth = isDesktop ? width * 0.45 : width - 40;

  // الإحصائيات العامة
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
      <Sidebar />
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>لوحة التحكم العامة</Text>
            <Text style={styles.subtitle}>نظرة شاملة على أداء المنصة</Text>
          </View>

          {/* الأزرار العلوية لتبديل المدة */}
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

          {/* البطاقات */}
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

          {/* الرسوم البيانية */}
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

          {/* الجداول */}
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
  col3: { flex: 1, color: "#2563eb", textAlign: "center" },
  col4: { flex: 1, color: "#000", textAlign: "right", fontWeight: "700" },
});

export default SuperAdminDashboard;

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
import Sidebar from "../../dashboard/sidebar";

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

const MOCK_ORDERS: Order[] = [
  { id: "O001", store: "سوريا زون", customer: "محمد علي", status: "مكتمل", total: 180000, date: "2025-11-09" },
  { id: "O002", store: "الكترونيات المستقبل", customer: "رنا كمال", status: "قيد التنفيذ", total: 250000, date: "2025-11-09" },
  { id: "O003", store: "متجر الأزياء", customer: "نور خليل", status: "ملغى", total: 90000, date: "2025-11-08" },
  { id: "O004", store: "سوريا زون", customer: "حسن ديب", status: "مكتمل", total: 350000, date: "2025-11-08" },
  { id: "O005", store: "الكترونيات المستقبل", customer: "مها ناصر", status: "قيد التنفيذ", total: 210000, date: "2025-11-07" },
  { id: "O006", store: "متجر الأزياء", customer: "إياد عبدو", status: "مكتمل", total: 125000, date: "2025-11-06" },
];

const CHARTS = {
  يومي: { labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], values: [12, 18, 22, 16, 25, 28, 20] },
  أسبوعي: { labels: ["W1", "W2", "W3", "W4"], values: [60, 72, 54, 80] },
  شهري: {
    labels: ["ينا", "فبر", "مار", "أب", "ماي", "يون", "يول", "أغس", "سبت", "أكت", "نوف", "ديس"],
    values: [120, 135, 160, 155, 180, 190, 200, 220, 210, 230, 240, 250],
  },
};

const OrdersManagement: React.FC = () => {
  const { width } = useWindowDimensions();
  const [range, setRange] = useState<Range>("شهري");

  const isMobile = width < 830;
  const isDesktop = width >= 1024;
  const chartsWidth = isDesktop ? width * 0.45 : width - 40;

  // حساب الإحصائيات
  const totalOrders = MOCK_ORDERS.length;
  const completed = MOCK_ORDERS.filter((o) => o.status === "مكتمل").length;
  const inProgress = MOCK_ORDERS.filter((o) => o.status === "قيد التنفيذ").length;
  const cancelled = MOCK_ORDERS.filter((o) => o.status === "ملغى").length;
  const avgValue = Math.round(
    MOCK_ORDERS.reduce((a, b) => a + b.total, 0) / Math.max(1, totalOrders)
  );

  const barData = useMemo(() => {
    const d = CHARTS[range];
    const colors = d.values.map(() => randomColor());
    return { labels: d.labels, values: d.values, colors };
  }, [range]);

  const pieData = [
    { name: "مكتمل", population: completed, color: "#22c55e", legendFontColor: "#000", legendFontSize: 12 },
    { name: "قيد التنفيذ", population: inProgress, color: "#2563eb", legendFontColor: "#000", legendFontSize: 12 },
    { name: "ملغى", population: cancelled, color: "#ef4444", legendFontColor: "#000", legendFontSize: 12 },
  ];

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
            <Text style={styles.title}>إدارة الطلبات</Text>
            <Text style={styles.subtitle}>نظرة عامة على حالة الطلبات في المنصة</Text>
          </View>

          {/* الأزرار العلوية */}
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

          {/* بطاقات الملخص */}
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

          {/* الجدول */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📦 قائمة الطلبات</Text>
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
  col3: { flex: 1, color: "#000" },
  colStatus: { flex: 1, fontWeight: "700", textAlign: "center" },
  col4: { flex: 1, color: "#000", textAlign: "right", fontWeight: "700" },
});

export default OrdersManagement;

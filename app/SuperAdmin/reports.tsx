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
import { BarChart, PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import Sidebar from "../dashboard/sidebar";

type Range = "يومي" | "أسبوعي" | "شهري";

interface Report {
  id: string;
  store: string;
  sales: number;
  orders: number;
  growth: number;
  topCustomer: string;
}

const MOCK_REPORTS: Report[] = [
  { id: "R001", store: "TechZone", sales: 850000, orders: 220, growth: 12, topCustomer: "أحمد علي" },
  { id: "R002", store: "FashionWay", sales: 530000, orders: 180, growth: 9, topCustomer: "رنا حسن" },
  { id: "R003", store: "SmartStore", sales: 460000, orders: 150, growth: 6, topCustomer: "محمد كمال" },
  { id: "R004", store: "GameHub", sales: 320000, orders: 90, growth: 3, topCustomer: "سارة يوسف" },
  { id: "R005", store: "BeautyMart", sales: 280000, orders: 75, growth: 5, topCustomer: "نور خليل" },
];

const CHARTS = {
  يومي: { labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], values: [120000, 160000, 90000, 200000, 180000, 150000, 170000] },
  أسبوعي: { labels: ["Week1", "Week2", "Week3", "Week4"], values: [750000, 920000, 880000, 1040000] },
  شهري: { labels: ["ينا", "فبر", "مار", "أب", "ماي", "يون", "يول", "أغس", "سبت", "أكت", "نوف", "ديس"], values: [400000, 520000, 610000, 730000, 880000, 940000, 1020000, 980000, 1120000, 1250000, 1310000, 1400000] },
};

const PIE_DATA = [
  { name: "TechZone", value: 40 },
  { name: "FashionWay", value: 25 },
  { name: "SmartStore", value: 20 },
  { name: "GameHub", value: 10 },
  { name: "BeautyMart", value: 5 },
];

const getRandomColor = () => "#" + Math.floor(Math.random() * 16777215).toString(16);
const currency = (v: number) => v.toLocaleString() + " ل.س";

const ReportsManagement: React.FC = () => {
  const { width } = useWindowDimensions();
  const [range, setRange] = useState<Range>("شهري");
  const [reports] = useState<Report[]>(MOCK_REPORTS);

  const isDesktop = width >= 1024;
  const isMobile = width < 830;
  const chartsWidth = isDesktop ? width * 0.45 : width - 40;

  const barData = useMemo(() => {
    const chart = CHARTS[range];
    const colors = chart.values.map(() => getRandomColor());
    return { ...chart, colors };
  }, [range]);

  const pieData = PIE_DATA.map((p) => ({
    name: p.name,
    population: p.value,
    color: getRandomColor(),
    legendFontColor: "#000",
    legendFontSize: 12,
  }));

  const totals = useMemo(
    () => ({
      totalSales: reports.reduce((s, x) => s + x.sales, 0),
      totalOrders: reports.reduce((s, x) => s + x.orders, 0),
      avgGrowth: Math.round(reports.reduce((s, x) => s + x.growth, 0) / reports.length),
      totalStores: reports.length,
    }),
    [reports]
  );

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(37,99,235,${opacity})`,
    labelColor: () => "#000",
    propsForBackgroundLines: { stroke: "#eee" },
  };

  return (
    <View style={{ flex: 1, flexDirection: isMobile ? "column" : "row" }}>
      <Sidebar />
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>📈 التقارير</Text>
            <Text style={styles.subtitle}>نظرة عامة على أداء النظام</Text>
          </View>

          {/* Range Filter */}
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
              <Text style={styles.cardLabel}>إجمالي المبيعات</Text>
              <Text style={styles.cardValue}>{currency(totals.totalSales)}</Text>
            </View>
            <View style={[styles.summaryCard, isDesktop && { width: "23%" }]}>
              <Text style={styles.cardLabel}>عدد الطلبات</Text>
              <Text style={styles.cardValue}>{totals.totalOrders}</Text>
            </View>
            <View style={[styles.summaryCard, isDesktop && { width: "23%" }]}>
              <Text style={styles.cardLabel}>نسبة النمو</Text>
              <Text style={styles.cardValue}>{totals.avgGrowth}%</Text>
            </View>
            <View style={[styles.summaryCard, isDesktop && { width: "23%" }]}>
              <Text style={styles.cardLabel}>عدد المتاجر</Text>
              <Text style={styles.cardValue}>{totals.totalStores}</Text>
            </View>
          </View>

          {/* Charts */}
          <View style={[styles.chartsArea, isDesktop && styles.chartsAreaDesktop]}>
            <View style={[styles.chartCard, isDesktop ? { width: chartsWidth } : { width: "100%" }]}>
              <Text style={styles.chartTitle}>{range} — المبيعات</Text>
              <BarChart
                data={{
                  labels: barData.labels,
                  datasets: [{ data: barData.values, colors: barData.colors.map((c) => () => c) }],
                }}
                width={chartsWidth - 10}
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={chartConfig}
                fromZero
                showBarTops={false}
                withCustomBarColorFromData
                flatColor
                style={styles.chartStyle}
              />
            </View>

            <View style={[styles.chartCard, isDesktop ? { width: chartsWidth } : { width: "100%" }]}>
              <Text style={styles.chartTitle}>نسبة المبيعات حسب المتجر</Text>
              <PieChart
                data={pieData as any}
                width={chartsWidth - 10}
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

          {/* Reports Table */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 تقارير الأداء</Text>
            <FlatList
              data={reports}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.reportRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reportStore}>{item.store}</Text>
                    <Text style={styles.reportCustomer}>العميل الأعلى: {item.topCustomer}</Text>
                  </View>
                  <View style={styles.reportStats}>
                    <Text style={styles.reportValue}>{currency(item.sales)}</Text>
                    <Text style={styles.reportSub}>مبيعات</Text>
                  </View>
                  <View style={styles.reportStats}>
                    <Text style={styles.reportValue}>{item.orders}</Text>
                    <Text style={styles.reportSub}>طلبات</Text>
                  </View>
                  <View style={styles.reportStats}>
                    <Text style={[styles.reportValue, { color: item.growth > 0 ? "#16a34a" : "#dc2626" }]}>
                      {item.growth}%
                    </Text>
                    <Text style={styles.reportSub}>نمو</Text>
                  </View>
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 40 }}
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
    margin: 5,
  },
  cardLabel: { color: "#666" },
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
  reportRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e6eefc",
    padding: 12,
    marginBottom: 8,
  },
  reportStore: { color: "#2563eb", fontWeight: "700" },
  reportCustomer: { color: "#000" },
  reportStats: { alignItems: "center", width: 80 },
  reportValue: { fontWeight: "800", color: "#000" },
  reportSub: { fontSize: 12, color: "#666" },
});

export default ReportsManagement;

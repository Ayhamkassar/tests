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
import VendorsSideBar from "../../dashboard/vendorsSideBar";

type Range = "يومي" | "أسبوعي" | "شهري";
interface Sale {
  id: string;
  customer: string;
  total: number;
  date: string;
  itemsCount?: number;
}

const currency = (v: number) => v.toLocaleString() + " ل.س";
const getRandomColor = (seed?: number) => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
};

const MOCK_SALES: Sale[] = [
  { id: "S001", customer: "أحمد علي", total: 120000, date: "2025-11-07", itemsCount: 2 },
  { id: "S002", customer: "سارة يوسف", total: 85000, date: "2025-11-06", itemsCount: 1 },
  { id: "S003", customer: "محمد كمال", total: 64000, date: "2025-11-05", itemsCount: 3 },
  { id: "S004", customer: "نور خليل", total: 215000, date: "2025-11-04", itemsCount: 4 },
  { id: "S005", customer: "رنا حسن", total: 145000, date: "2025-11-03", itemsCount: 1 },
  { id: "S006", customer: "حاتم سعيد", total: 178000, date: "2025-11-02", itemsCount: 2 },
];

const CHARTS = {
  يومي: { labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], values: [120000, 85000, 64000, 215000, 145000, 178000, 162000] },
  أسبوعي: { labels: ["Week1", "Week2", "Week3", "Week4"], values: [450000, 520000, 480000, 610000] },
  شهري: {
    labels: ["ينا", "فبر", "مار", "أب", "ماي", "يون", "يول", "أغس", "سبت", "أكت", "نوف", "ديس"],
    values: [500000, 650000, 720000, 800000, 950000, 1100000, 970000, 880000, 920000, 1050000, 1130000, 1200000],
  },
};

const PIE_SECTIONS = [
  { name: "إلكترونيات", value: 45 },
  { name: "إكسسوارات", value: 25 },
  { name: "ملابس", value: 15 },
  { name: "أحذية", value: 10 },
  { name: "أخرى", value: 5 },
];

const SalesManagement: React.FC = () => {
  const { width } = useWindowDimensions();
  const [range, setRange] = useState<Range>("شهري");
  const [sales] = useState<Sale[]>(MOCK_SALES);
  const isMobile = width < 830;
  const isDesktop = width >= 1024;
  const chartsWidth = isDesktop ? width * 0.45 : width - 40;

  const totalRevenue = useMemo(() => sales.reduce((s, x) => s + x.total, 0), [sales]);
  const totalOrders = sales.length;
  const avgOrder = Math.round(totalRevenue / Math.max(1, totalOrders));

  const barData = useMemo(() => {
    const key = range;
    const labels = CHARTS[key].labels;
    const values = CHARTS[key].values;
    const colors = values.map((_, i) => getRandomColor(i + values.length));
    return { labels, values, colors };
  }, [range]);

  const pieData = useMemo(
    () =>
      PIE_SECTIONS.map((p, i) => ({
        name: p.name,
        population: p.value,
        color: getRandomColor(i + 10),
        legendFontColor: "#000",
        legendFontSize: 12,
      })),
    []
  );

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    fillShadowGradientOpacity: 1,
    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
    labelColor: () => "#000",
    propsForBackgroundLines: { stroke: "#f0f0f0" },
  };

  return (
    <View style={{ flex: 1, flexDirection: isMobile ? "column" : "row" }}>
      <VendorsSideBar />
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>إدارة المبيعات</Text>
            <Text style={styles.subtitle}>نظرة سريعة على أداء متجرك</Text>
          </View>

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

          {/* Summary */}
          <View style={[styles.summaryRow, isDesktop && { justifyContent: "space-between" }]}>
            <View style={[styles.summaryCard, isDesktop && { width: "32%" }]}>
              <Text style={styles.cardLabel}>إجمالي الإيرادات</Text>
              <Text style={styles.cardValue}>{currency(totalRevenue)}</Text>
              <Text style={styles.cardNote}>مجموع كل الفترات</Text>
            </View>
            <View style={[styles.summaryCard, isDesktop && { width: "32%" }]}>
              <Text style={styles.cardLabel}>عدد الطلبات</Text>
              <Text style={styles.cardValue}>{totalOrders}</Text>
              <Text style={styles.cardNote}>عدد الطلبات المسجلة</Text>
            </View>
            <View style={[styles.summaryCard, isDesktop && { width: "32%" }]}>
              <Text style={styles.cardLabel}>متوسط قيمة الطلب</Text>
              <Text style={styles.cardValue}>{currency(avgOrder)}</Text>
              <Text style={styles.cardNote}>متوسط لكل طلب</Text>
            </View>
          </View>

          {/* Charts */}
          <View style={[styles.chartsArea, isDesktop ? styles.chartsAreaDesktop : null]}>
            <View style={[styles.chartCard, isDesktop ? { width: chartsWidth } : { width: "100%" }]}>
              <Text style={styles.chartTitle}>{range} — المبيعات</Text>
              <BarChart
                data={{
                  labels: barData.labels,
                  datasets: [{ data: barData.values, colors: barData.colors.map((c) => () => c) }],
                }}
                yAxisSuffix=''
                width={isDesktop ? chartsWidth - 20 : chartsWidth}
                height={220}
                chartConfig={chartConfig}
                yAxisLabel="ل.س"
                fromZero
                showBarTops={false}
                withCustomBarColorFromData
                flatColor
                style={styles.chartStyle}
              />
            </View>

            <View style={[styles.chartCard, isDesktop ? { width: chartsWidth } : { width: "100%" }]}>
              <Text style={styles.chartTitle}>توزيع الفئات</Text>
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

          {/* List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>آخر المبيعات</Text>
            <FlatList
              data={sales}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.saleRow}>
                  <View>
                    <Text style={styles.saleId}>#{item.id}</Text>
                    <Text style={styles.saleCustomer}>{item.customer}</Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.saleTotal}>{currency(item.total)}</Text>
                    <Text style={styles.saleDate}>{item.date}</Text>
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
  summaryRow: { flexDirection: "row", marginBottom: 18 },
  summaryCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e6eefc",
    marginHorizontal: 4,
  },
  cardLabel: { color: "#666" },
  cardValue: { color: "#2563eb", fontSize: 18, fontWeight: "800" },
  cardNote: { color: "#999", fontSize: 12 },
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
  saleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e6eefc",
    marginBottom: 8,
  },
  saleId: { color: "#2563eb", fontWeight: "700" },
  saleCustomer: { color: "#000" },
  saleTotal: { color: "#000", fontWeight: "700" },
  saleDate: { color: "#666", fontSize: 12 },
});

export default SalesManagement;

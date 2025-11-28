import React, { useMemo, useState } from "react";
import { View, ScrollView, SafeAreaView, useWindowDimensions } from "react-native";
import VendorsSideBar from "../../dashboard/vendorsSideBar";
import SummaryCard from "../../../components/VDashboard/SummaryCard";
import RangeSelector from "../../../components/VDashboard/RangeSelector";
import ChartsSection from "../../../components/VDashboard/ChartSection";
import SalesList from "../../../components/VDashboard/SalesList";
import styles from "../../styles/vdashstyle";

type Range = "يومي" | "أسبوعي" | "شهري";

interface Sale {
  id: string;
  customer: string;
  total: number;
  date: string;
}

const MOCK_SALES: Sale[] = [
  { id: "S001", customer: "أحمد علي", total: 120000, date: "2025-11-07" },
  { id: "S002", customer: "سارة يوسف", total: 85000, date: "2025-11-06" },
  { id: "S003", customer: "محمد كمال", total: 64000, date: "2025-11-05" },
  { id: "S004", customer: "نور خليل", total: 215000, date: "2025-11-04" },
  { id: "S005", customer: "رنا حسن", total: 145000, date: "2025-11-03" },
  { id: "S006", customer: "حاتم سعيد", total: 178000, date: "2025-11-02" },
];

const PIE_SECTIONS = [
  { name: "إلكترونيات", value: 45 },
  { name: "إكسسوارات", value: 25 },
  { name: "ملابس", value: 15 },
  { name: "أحذية", value: 10 },
  { name: "أخرى", value: 5 },
];

const SalesManagementScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const [range, setRange] = useState<Range>("شهري");
  const [sales] = useState<Sale[]>(MOCK_SALES);
  const isMobile = width < 830;
  const isDesktop = width >= 1024;
  const chartsWidth = isDesktop ? width * 0.45 : width - 40;

  const currency = (v: number) => v.toLocaleString() + " ل.س";

  const totalRevenue = useMemo(() => sales.reduce((s, x) => s + x.total, 0), [sales]);
  const totalOrders = sales.length;
  const avgOrder = Math.round(totalRevenue / Math.max(1, totalOrders));

  const getRandomColor = (seed?: number) => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
    return color;
  };

  const CHARTS = {
    يومي: { labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], values: [120000, 85000, 64000, 215000, 145000, 178000, 162000] },
    أسبوعي: { labels: ["Week1", "Week2", "Week3", "Week4"], values: [450000, 520000, 480000, 610000] },
    شهري: {
      labels: ["ينا", "فبر", "مار", "أب", "ماي", "يون", "يول", "أغس", "سبت", "أكت", "نوف", "ديس"],
      values: [500000, 650000, 720000, 800000, 950000, 1100000, 970000, 880000, 920000, 1050000, 1130000, 1200000],
    },
  };

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

  return (
    <View style={{ flex: 1, flexDirection: isMobile ? "column" : "row" }}>
      <VendorsSideBar />
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          <RangeSelector currentRange={range} setRange={setRange} />

          <View style={[styles.summaryRow, isDesktop && { justifyContent: "space-between" }]}>
            <SummaryCard label="إجمالي الإيرادات" value={currency(totalRevenue)} note="مجموع كل الفترات" width={isDesktop ? "32%" : undefined} />
            <SummaryCard label="عدد الطلبات" value={totalOrders} note="عدد الطلبات المسجلة" width={isDesktop ? "32%" : undefined} />
            <SummaryCard label="متوسط قيمة الطلب" value={currency(avgOrder)} note="متوسط لكل طلب" width={isDesktop ? "32%" : undefined} />
          </View>

          <ChartsSection range={range} barData={barData} pieData={pieData} chartsWidth={chartsWidth} />
          <SalesList sales={sales} currency={currency} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default SalesManagementScreen;

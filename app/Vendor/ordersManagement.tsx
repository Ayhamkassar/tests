import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import VendorsSideBar from "../dashboard/vendorsSideBar";

interface Order {
  id: string;
  customer: string;
  total: number;
  date: string;
  status: "قيد المعالجة" | "مكتمل" | "ملغي";
}

const screenWidth = Dimensions.get("window").width;
const isMobile = screenWidth < 830;

const OrdersManagement: React.FC = () => {
  const [filter, setFilter] = useState<"الكل" | Order["status"]>("الكل");
  const [orders, setOrders] = useState<Order[]>([
    { id: "1", customer: "أحمد علي", total: 120000, date: "2025-11-05", status: "قيد المعالجة" },
    { id: "2", customer: "سارة يوسف", total: 85000, date: "2025-11-04", status: "مكتمل" },
    { id: "3", customer: "محمد كمال", total: 64000, date: "2025-11-03", status: "ملغي" },
    { id: "4", customer: "نور خليل", total: 215000, date: "2025-11-02", status: "قيد المعالجة" },
  ]);

  const filteredOrders =
    filter === "الكل" ? orders : orders.filter((o) => o.status === filter);

  const changeStatus = (id: string, newStatus: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Ionicons name="receipt-outline" size={22} color="#2563eb" />
        <Text style={styles.orderId}>طلب رقم #{item.id}</Text>
      </View>

      <Text style={styles.orderText}>الزبون: {item.customer}</Text>
      <Text style={styles.orderText}>المجموع: {item.total.toLocaleString()} ل.س</Text>
      <Text style={styles.orderText}>التاريخ: {item.date}</Text>

      <Text
        style={[
          styles.status,
          item.status === "قيد المعالجة"
            ? { color: "#f59e0b" }
            : item.status === "مكتمل"
            ? { color: "green" }
            : { color: "red" },
        ]}
      >
        الحالة: {item.status}
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: "#2563eb" }]}
          onPress={() => changeStatus(item.id, "مكتمل")}
        >
          <Text style={styles.btnText}>تحديد كمكتمل</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: "#f59e0b" }]}
          onPress={() => changeStatus(item.id, "قيد المعالجة")}
        >
          <Text style={styles.btnText}>قيد المعالجة</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: "#dc2626" }]}
          onPress={() => changeStatus(item.id, "ملغي")}
        >
          <Text style={styles.btnText}>إلغاء</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.mainContainer, { flexDirection: isMobile ? "column" : "row" }]}>
      <VendorsSideBar />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>إدارة الطلبات</Text>

        {/* 🔍 الفلترة */}
        <View style={styles.filters}>
          {["الكل", "قيد المعالجة", "مكتمل", "ملغي"].map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterBtn,
                filter === f && { backgroundColor: "#2563eb" },
              ]}
              onPress={() => setFilter(f as any)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === f && { color: "#fff" },
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 📦 الطلبات */}
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: { flex: 1, backgroundColor: "#fff", padding: 15 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginVertical: 15,
  },
  filters: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  filterBtn: {
    borderWidth: 1,
    borderColor: "#2563eb",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  filterText: { color: "#000", fontWeight: "600" },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#2563eb33",
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  orderId: { fontWeight: "bold", fontSize: 16, marginLeft: 5, color: "#000" },
  orderText: { color: "#000", fontSize: 14, marginBottom: 2 },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionBtn: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 10,
    paddingVertical: 6,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
});

export default OrdersManagement;

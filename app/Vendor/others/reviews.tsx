import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from "react-native-reanimated";
import VendorsSideBar from "../../dashboard/vendorsSideBar";

const screenWidth = Dimensions.get("window").width;

const initialReviews = [
  { id: "1", customer: "أحمد علي", rating: 5, comment: "منتج ممتاز وسريع التوصيل!" },
  { id: "2", customer: "سارة محمد", rating: 4, comment: "جيد لكن يحتاج تحسين التغليف." },
  { id: "3", customer: "خالد يوسف", rating: 3, comment: "المواصفات غير دقيقة." },
  { id: "4", customer: "ليلى حسن", rating: 5, comment: "أنصح الجميع بهذا المنتج!" },
];

const menuItems = [
  { label: "الصفحة الرئيسية", icon: "home-outline", route: "/dashboard/dashboard" },//finishied
  { label: "إضافة منتج جديد", icon: "add-circle-outline", route: "/Vendor/Product/addProduct" },//finishied
  { label: "إدارة الطلبات", icon: "receipt-outline", route: "/Vendor/ordersManagement" },//finishied
  { label: "إدارة المراجعات", icon: "chatbubbles-outline", route: "/Vendor/others/reviews" },//finishied
  { label: "إدارة المخزون", icon: "cube-outline", route: "/Vendor/others/inventory" },
  { label: "إدارة التوصيلات", icon: "bicycle-outline", route: "/Vendor/deliveries" },
  { label: "إعدادات المتجر", icon: "settings-outline", route: "/Vendor/store/storeSettings" },
];

const reviews = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(3); // إدارة المراجعات
  const [reviews, setReviews] = useState(initialReviews);

  const drawerX = useSharedValue(-260);
  const toggleDrawer = () => {
    drawerX.value = withTiming(drawerOpen ? -260 : 0, { duration: 300 });
    setDrawerOpen(!drawerOpen);
  };
  const animatedDrawerStyle = useAnimatedStyle(() => ({ left: drawerX.value }));

  const deleteReview = (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id));
  };

  return (
    <View style={styles.screen}>
      {/* Sidebar للكمبيوتر */}
      {screenWidth >= 1024 ? (
        <VendorsSideBar />
      ) : (
        <>
          <TouchableOpacity style={styles.menuBtn} onPress={toggleDrawer}>
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>

          {drawerOpen && <TouchableOpacity style={styles.overlay} onPress={toggleDrawer} />}

          <Animated.View style={[styles.drawer, animatedDrawerStyle]}>
            <Text style={styles.drawerTitle}>القائمة</Text>
            {menuItems.map((item, idx) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.drawerItem, idx === activeIndex && { backgroundColor: "#2563eb22" }]}
                onPress={() => {
                  setActiveIndex(idx);
                  router.replace(item.route as any);
                  toggleDrawer();
                }}
              >
                <Ionicons name={item.icon as any} size={20} color="#2563eb" />
                <Text style={styles.drawerText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </>
      )}

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.pageTitle}>إدارة المراجعات</Text>

        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.reviewCard}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={styles.customerName}>{item.customer}</Text>
                <View style={{ flexDirection: "row" }}>
                  {[...Array(5)].map((_, i) => (
                    <Ionicons
                      key={i}
                      name={i < item.rating ? "star" : "star-outline"}
                      size={16}
                      color="#facc15"
                    />
                  ))}
                </View>
              </View>
              <Text style={styles.commentText}>{item.comment}</Text>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteReview(item.id)}>
                  <Text style={styles.deleteText}>حذف</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, flexDirection: screenWidth >= 1024 ? "row" : "column", backgroundColor: "#f5f5f5" },
  content: { flex: 1, backgroundColor: "#fff" },
  contentContainer: { padding: 15 },
  pageTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#000" },
  reviewCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#2563eb33",
  },
  customerName: { fontSize: 16, fontWeight: "bold", color: "#000" },
  commentText: { marginTop: 5, fontSize: 14, color: "#000" },
  actions: { marginTop: 10, flexDirection: "row", justifyContent: "flex-end" },
  deleteBtn: { backgroundColor: "red", borderRadius: 6, paddingVertical: 5, paddingHorizontal: 15 },
  deleteText: { color: "#fff", fontWeight: "bold" },
  menuBtn: { position: "absolute", top: 40, left: 20, zIndex: 20, backgroundColor: "#2563eb", padding: 10, borderRadius: 8 },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 9 },
  drawer: { position: "absolute", top: 0, left: 0, width: 250, height: "100%", backgroundColor: "#fff", paddingTop: 80, paddingHorizontal: 15, borderTopRightRadius: 20, borderBottomRightRadius: 20, zIndex: 10, elevation: 10 },
  drawerTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, color: "#2563eb" },
  drawerItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderRadius: 10, marginBottom: 8 },
  drawerText: { color: "#000", fontSize: 16, marginLeft: 10 },
});

export default reviews;

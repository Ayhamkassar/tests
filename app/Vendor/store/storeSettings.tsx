import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from "react-native-reanimated";
import VendorsSideBar from "../../dashboard/vendorsSideBar";
import * as ImagePicker from "react-native-image-picker";

const screenWidth = Dimensions.get("window").width;

const menuItems = [
  { label: "الصفحة الرئيسية", icon: "home-outline", route: "/dashboard/dashboard" },
  { label: "إضافة منتج جديد", icon: "add-circle-outline", route: "/Vendor/addProduct" },
  { label: "إدارة الطلبات", icon: "receipt-outline", route: "/Vendor/ordersManagement" },
  { label: "إدارة المراجعات", icon: "chatbubbles-outline", route: "/Vendor/reviews" },
  { label: "إدارة المخزون", icon: "cube-outline", route: "/Vendor/inventory" },
  { label: "إدارة التوصيلات", icon: "bicycle-outline", route: "/Vendor/deliveries" },
  { label: "إعدادات المتجر", icon: "settings-outline", route: "/Vendor/storeSettings" },
];

const StoreSettingsPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(6);

  const drawerX = useSharedValue(-260);
  const toggleDrawer = () => {
    drawerX.value = withTiming(drawerOpen ? -260 : 0, { duration: 300 });
    setDrawerOpen(!drawerOpen);
  };
  const animatedDrawerStyle = useAnimatedStyle(() => ({ left: drawerX.value }));

  // بيانات المتجر
  const [storeName, setStoreName] = useState("متجر سوريا زون");
  const [storeDesc, setStoreDesc] = useState("بيع الإلكترونيات والإكسسوارات بأسعار مناسبة.");
  const [storeStatus, setStoreStatus] = useState(true); // true = نشط
  const [storeLogo, setStoreLogo] = useState("https://via.placeholder.com/100");

  // إشعارات
  const [notifyOrders, setNotifyOrders] = useState(true);
  const [notifyReviews, setNotifyReviews] = useState(true);
  const [notifyDeliveries, setNotifyDeliveries] = useState(false);

  // كلمة المرور
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // خيارات متقدمة
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // اختيار صورة
  const pickImage = () => {
    ImagePicker.launchImageLibrary(
      { mediaType: "photo", maxHeight: 300, maxWidth: 300, quality: 0.7 },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          setStoreLogo(response.assets[0].uri!);
        }
      }
    );
  };

  const saveSettings = () => {
    alert("تم حفظ الإعدادات بنجاح!");
  };

  return (
    <View style={styles.screen}>
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
        <Text style={styles.pageTitle}>إعدادات المتجر</Text>

        {/* معلومات المتجر */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>معلومات المتجر</Text>

          {/* صورة المتجر */}
          <TouchableOpacity style={styles.logoContainer} onPress={pickImage}>
            <Image source={{ uri: storeLogo }} style={styles.logo} />
            <Text style={styles.changeLogoText}>تغيير الصورة</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="اسم المتجر"
            value={storeName}
            onChangeText={setStoreName}
          />
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="وصف المتجر"
            value={storeDesc}
            multiline
            onChangeText={setStoreDesc}
          />
          <View style={styles.switchRow}>
            <Text>حالة المتجر</Text>
            <Switch value={storeStatus} onValueChange={setStoreStatus} />
          </View>
        </View>

        {/* إشعارات */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الإشعارات</Text>
          <View style={styles.switchRow}>
            <Text>الطلبات الجديدة</Text>
            <Switch value={notifyOrders} onValueChange={setNotifyOrders} />
          </View>
          <View style={styles.switchRow}>
            <Text>المراجعات</Text>
            <Switch value={notifyReviews} onValueChange={setNotifyReviews} />
          </View>
          <View style={styles.switchRow}>
            <Text>التوصيلات</Text>
            <Switch value={notifyDeliveries} onValueChange={setNotifyDeliveries} />
          </View>
        </View>

        {/* تغيير كلمة المرور */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>تغيير كلمة المرور</Text>
          <TextInput
            style={styles.input}
            placeholder="كلمة المرور الحالية"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="كلمة المرور الجديدة"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="تأكيد كلمة المرور"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        {/* خيارات متقدمة */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>خيارات متقدمة</Text>
          <View style={styles.switchRow}>
            <Text>وضع الصيانة</Text>
            <Switch value={maintenanceMode} onValueChange={setMaintenanceMode} />
          </View>
          <TouchableOpacity style={styles.deleteAccountBtn}>
            <Text style={styles.deleteAccountText}>حذف الحساب</Text>
          </TouchableOpacity>
        </View>

        {/* زر الحفظ */}
        <TouchableOpacity style={styles.saveBtn} onPress={saveSettings}>
          <Text style={styles.saveBtnText}>حفظ الإعدادات</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, flexDirection: screenWidth >= 1024 ? "row" : "column", backgroundColor: "#f5f5f5" },
  content: { flex: 1, backgroundColor: "#fff" },
  contentContainer: { padding: 15 },
  pageTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#000" },
  section: { marginBottom: 20, backgroundColor: "#fff", padding: 15, borderRadius: 15, elevation: 2, borderWidth: 1, borderColor: "#2563eb33" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#000" },
  input: { borderWidth: 1, borderColor: "#2563eb33", borderRadius: 8, padding: 10, marginBottom: 10, color: "#000" },
  switchRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  saveBtn: { backgroundColor: "#2563eb", borderRadius: 8, padding: 12, alignItems: "center", marginBottom: 30 },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  deleteAccountBtn: { backgroundColor: "#dc2626", borderRadius: 8, padding: 12, alignItems: "center", marginTop: 10 },
  deleteAccountText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  logoContainer: { alignItems: "center", marginBottom: 15 },
  logo: { width: 100, height: 100, borderRadius: 10, marginBottom: 5 },
  changeLogoText: { color: "#2563eb", fontWeight: "bold" },
  menuBtn: { position: "absolute", top: 40, left: 20, zIndex: 20, backgroundColor: "#2563eb", padding: 10, borderRadius: 8 },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 9 },
  drawer: { position: "absolute", top: 0, left: 0, width: 250, height: "100%", backgroundColor: "#fff", paddingTop: 80, paddingHorizontal: 15, borderTopRightRadius: 20, borderBottomRightRadius: 20, zIndex: 10, elevation: 10 },
  drawerTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, color: "#2563eb" },
  drawerItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderRadius: 10, marginBottom: 8 },
  drawerText: { color: "#000", fontSize: 16, marginLeft: 10 },
});

export default StoreSettingsPage;

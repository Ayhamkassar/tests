import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Easing, Image, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, Switch, TextInput } from "react-native";
import AnimatedReanimated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

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

const screenWidth = Dimensions.get("window").width;
const isMobile = screenWidth < 830;

const Settings = () => {
  const [open, setOpen] = useState(true);
  const [activeIndex, setActiveIndex] = useState(7); // إعدادات النظام هو الأخير
  const [openDrawer, setOpenDrawer] = useState(false);
  const indicatorY = useRef(new Animated.Value(activeIndex * MENU_ITEM_HEIGHT)).current;
  const widthAnim = useRef(new Animated.Value(OPEN_WIDTH)).current;
  const drawerX = useSharedValue(-260);

  // بيانات المستخدم ونمط الصفحة
  const [profile, setProfile] = useState({
    name: "أيهم قصار",
    email: "admin@syriazone.com",
    password: "",
    language: "العربية",
    theme: "فاتح",
    notifications: true,
    image: "https://via.placeholder.com/80",
  });

  const handleChange = (key: string, value: any) => setProfile({ ...profile, [key]: value });
  const handleSave = () => alert("✅ تم حفظ التغييرات بنجاح!");

  // sidebar حركة
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
  const animatedDrawerStyle = useAnimatedStyle(() => ({ left: drawerX.value }));
  const showLabels = open;

  const switchpage = (route: string, idx: number) => {
    setActiveIndex(idx);
    if (route) router.replace(route as any);
    if (isMobile) {
      drawerX.value = withTiming(-260, { duration: 300 });
      setOpenDrawer(false);
    }
  };
  const toggleDrawer = () => {
    if (openDrawer) drawerX.value = withTiming(-260, { duration: 300 });
    else drawerX.value = withTiming(0, { duration: 300 });
    setOpenDrawer(!openDrawer);
  };

  if (!isMobile) {
    return (
      <SafeAreaView style={styles.root}>
        <Animated.View style={[styles.sidebar, { width: widthAnim }]}> {/* sidebar نفسه */}
          <View style={styles.header}>
            <Pressable onPress={() => setOpen((o) => !o)} style={styles.burgerBtn}>
              <Ionicons name="menu" size={24} color="#f9f9f9" />
            </Pressable>
            {showLabels && (
              <Image source={require("../../../assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
            )}
          </View>
          <View style={styles.menu}>
            <Animated.View pointerEvents="none" style={[styles.indicator, { transform: [{ translateY: indicatorY }] }]} />
            {menuItems.map((item, idx) => {
              const active = idx === activeIndex;
              return (
                <Pressable key={item.label} onPress={() => switchpage(item.route, idx)} style={({ pressed }) => [styles.item, active && styles.itemActive, pressed && styles.itemPressed] }>
                  <Ionicons name={item.icon as any} size={22} color="#f9f9f9" />
                  {showLabels && (
                    <Text style={[styles.itemText, active && styles.itemTextActive]}>{item.label}</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
        <ScrollView contentContainerStyle={styles.container} style={{ flex: 1, backgroundColor: "#f5f7fb" }}>
          <Text style={styles.title}>إعدادات النظام</Text>
          <Text style={styles.subtitle}>تحكم في إعدادات حسابك والمظهر العام</Text>
          <View style={styles.profileSection}>
            <Image source={{ uri: profile.image }} style={styles.profileImage} />
            <TouchableOpacity style={styles.uploadBtn}>
              <Ionicons name="camera-outline" size={20} color="#fff" />
              <Text style={styles.uploadText}>تغيير الصورة</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>معلومات الحساب</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>الاسم الكامل</Text>
              <TextInput style={styles.input} value={profile.name} onChangeText={(text) => handleChange("name", text)} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>البريد الإلكتروني</Text>
              <TextInput style={styles.input} value={profile.email} onChangeText={(text) => handleChange("email", text)} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>كلمة المرور</Text>
              <TextInput style={styles.input} value={profile.password} onChangeText={(text) => handleChange("password", text)} secureTextEntry placeholder="********" />
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الإعدادات العامة</Text>
            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>اللغة</Text>
              <TouchableOpacity style={styles.optionSelector} onPress={() => handleChange("language", profile.language === "العربية" ? "English" : "العربية") }>
                <Text style={styles.optionValue}>{profile.language}</Text>
                <Ionicons name="swap-horizontal-outline" size={20} color="#2563eb" />
              </TouchableOpacity>
            </View>
            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>الثيم</Text>
              <TouchableOpacity style={styles.optionSelector} onPress={() => handleChange("theme", profile.theme === "فاتح" ? "داكن" : "فاتح") }>
                <Text style={styles.optionValue}>{profile.theme}</Text>
                <Ionicons name={profile.theme === "فاتح" ? "sunny-outline" : "moon-outline"} size={20} color="#2563eb" />
              </TouchableOpacity>
            </View>
            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>الإشعارات</Text>
              <Switch value={profile.notifications} onValueChange={(val) => handleChange("notifications", val)} trackColor={{ false: "#ccc", true: "#2563eb" }} thumbColor="#fff" />
            </View>
          </View>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Ionicons name="save-outline" size={20} color="#fff" />
            <Text style={styles.saveText}>حفظ التغييرات</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  } else {
    // واجهة الموبايل: زر منيو ودرج جانبي
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f7fb" }}>
        <TouchableOpacity style={styles.menuBtn} onPress={toggleDrawer}>
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        {openDrawer && (
          <TouchableOpacity style={styles.overlay} onPress={toggleDrawer} activeOpacity={1} />
        )}
        <AnimatedReanimated.View style={[styles.drawer, animatedDrawerStyle]}>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>القائمة</Text>
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
        {/* محتوى الصفحة */}
        <ScrollView contentContainerStyle={styles.container} style={{ flex: 1, backgroundColor: "#f5f7fb" }}>
          <Text style={styles.title}>إعدادات النظام</Text>
          <Text style={styles.subtitle}>تحكم في إعدادات حسابك والمظهر العام</Text>
          <View style={styles.profileSection}>
            <Image source={{ uri: profile.image }} style={styles.profileImage} />
            <TouchableOpacity style={styles.uploadBtn}>
              <Ionicons name="camera-outline" size={20} color="#fff" />
              <Text style={styles.uploadText}>تغيير الصورة</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>معلومات الحساب</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>الاسم الكامل</Text>
              <TextInput style={styles.input} value={profile.name} onChangeText={(text) => handleChange("name", text)} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>البريد الإلكتروني</Text>
              <TextInput style={styles.input} value={profile.email} onChangeText={(text) => handleChange("email", text)} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>كلمة المرور</Text>
              <TextInput style={styles.input} value={profile.password} onChangeText={(text) => handleChange("password", text)} secureTextEntry placeholder="********" />
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الإعدادات العامة</Text>
            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>اللغة</Text>
              <TouchableOpacity style={styles.optionSelector} onPress={() => handleChange("language", profile.language === "العربية" ? "English" : "العربية") }>
                <Text style={styles.optionValue}>{profile.language}</Text>
                <Ionicons name="swap-horizontal-outline" size={20} color="#2563eb" />
              </TouchableOpacity>
            </View>
            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>الثيم</Text>
              <TouchableOpacity style={styles.optionSelector} onPress={() => handleChange("theme", profile.theme === "فاتح" ? "داكن" : "فاتح") }>
                <Text style={styles.optionValue}>{profile.theme}</Text>
                <Ionicons name={profile.theme === "فاتح" ? "sunny-outline" : "moon-outline"} size={20} color="#2563eb" />
              </TouchableOpacity>
            </View>
            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>الإشعارات</Text>
              <Switch value={profile.notifications} onValueChange={(val) => handleChange("notifications", val)} trackColor={{ false: "#ccc", true: "#2563eb" }} thumbColor="#fff" />
            </View>
          </View>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Ionicons name="save-outline" size={20} color="#fff" />
            <Text style={styles.saveText}>حفظ التغييرات</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: "row", backgroundColor: "#f5f7fb" },
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
  header: {
    height: 72,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 20,
  },
  burgerBtn: {
    width: 70,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: { height: 24, marginLeft: 8 },
  menu: { flex: 1 },
  indicator: {
    position: "absolute",
    left: 0,
    top: 0,
    height: MENU_ITEM_HEIGHT,
    width: 5,
    backgroundColor: "#6199f7",
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  item: {
    height: MENU_ITEM_HEIGHT,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    opacity: 0.6,
  },
  itemPressed: { backgroundColor: "rgba(0,0,0,0.2)" },
  itemActive: { backgroundColor: "rgba(0,0,0,0.08)", opacity: 1 },
  itemText: { color: "#f9f9f9", fontSize: 16 },
  itemTextActive: { fontWeight: "600" },
  menuBtn: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 20,
    backgroundColor: "#2563eb",
    padding: 10,
    borderRadius: 8,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 9,
  },
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 250,
    height: "100%",
    backgroundColor: "#fff",
    paddingTop: 80,
    paddingHorizontal: 15,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 10,
    elevation: 10,
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  drawerTitle: { fontSize: 18, fontWeight: "bold", color: "#2563eb" },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  drawerItemActive: { backgroundColor: "#2563eb22" },
  drawerItemText: { color: "#000", fontSize: 16, marginLeft: 10 },
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: "800", color: "#000" },
  subtitle: { color: "#666", marginBottom: 16 },
  profileSection: { alignItems: "center", marginBottom: 20 },
  profileImage: { width: 90, height: 90, borderRadius: 50, marginBottom: 8 },
  uploadBtn: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  uploadText: { color: "#fff", fontWeight: "bold", marginLeft: 4 },
  section: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e6eefc",
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10, color: "#000" },
  inputGroup: { marginBottom: 10 },
  label: { color: "#666", marginBottom: 4 },
  input: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "#000",
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  optionLabel: { color: "#000", fontWeight: "600" },
  optionSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  optionValue: { color: "#2563eb", marginRight: 8 },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563eb",
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 10,
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "bold", marginLeft: 6 },
});

export default Settings;

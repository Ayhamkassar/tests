import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Easing, Image, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AnimatedReanimated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

const MENU_ITEM_HEIGHT = 56;
const OPEN_WIDTH = 250;
const CLOSED_WIDTH = 80;

const menuItems = [
  { label: "الصفحة الرئيسية", icon: "home-outline", route: "Vendor/dashboard/dashboard" },//finishied
  { label: "إضافة منتج جديد", icon: "add-circle-outline", route: "/Vendor/Product/addProduct" },//finishied
  { label: "إدارة الطلبات", icon: "receipt-outline", route: "/Vendor/ordersManagement" },//finishied
  { label: "إدارة المراجعات", icon: "chatbubbles-outline", route: "/Vendor/others/reviews" },
  { label: "إدارة المخزون", icon: "cube-outline", route: "/Vendor/others/inventory" },
  { label: "إعدادات المتجر", icon: "settings-outline", route: "/Vendor/store/storeSettings" },
];

const screenWidth = Dimensions.get("window").width;
const isMobile = screenWidth < 830;

export default function VendorsSideBar() {
  const [open, setOpen] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const indicatorY = useRef(new Animated.Value(0)).current;
  const widthAnim = useRef(new Animated.Value(OPEN_WIDTH)).current;
  const drawerX = useSharedValue(-260);

  const switchpage = (item: { route: string }, idx: number) => {
    setActiveIndex(idx);
    if (item.route) router.replace(item.route as any);
    if (isMobile) {
      drawerX.value = withTiming(-260, { duration: 300 });
      setOpenDrawer(false);
    }
  };

  const toggleDrawer = () => {
    if (openDrawer) {
      drawerX.value = withTiming(-260, { duration: 300 });
    } else {
      drawerX.value = withTiming(0, { duration: 300 });
    }
    setOpenDrawer(!openDrawer);
  };

  const animatedDrawerStyle = useAnimatedStyle(() => ({
    left: drawerX.value,
  }));

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

  const showLabels = open;

  if (!isMobile) {
    return (
      <SafeAreaView style={styles.root}>
        <Animated.View style={[styles.sidebar, { width: widthAnim }]}>
          <View style={styles.header}>
            <Pressable onPress={() => setOpen(o => !o)} style={styles.burgerBtn}>
              <Ionicons name="menu" size={24} color="#f9f9f9" />
            </Pressable>
            {showLabels ? (
              <Image
                source={require("../../assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            ) : null}
          </View>

          <View style={styles.menu}>
            <Animated.View
              pointerEvents="none"
              style={[
                styles.indicator,
                { transform: [{ translateY: indicatorY }] },
              ]}
            />
            {menuItems.map((item, idx) => {
              const active = idx === activeIndex;
              return (
                <Pressable
                  key={item.label}
                  onPress={() => switchpage(item, idx)}
                  style={({ pressed }) => [
                    styles.item,
                    active && styles.itemActive,
                    pressed && styles.itemPressed,
                  ]}
                >
                  <Ionicons name={item.icon as any} size={22} color="#f9f9f9" />
                  {showLabels ? (
                    <Text style={[styles.itemText, active && styles.itemTextActive]}>
                      {item.label}
                    </Text>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      </SafeAreaView>
    );
  } else {
    return (
      <>
        {/* زر المنيو */}
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={toggleDrawer}
        >
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Overlay */}
        {openDrawer && (
          <TouchableOpacity
            style={styles.overlay}
            onPress={toggleDrawer}
            activeOpacity={1}
          />
        )}

        {/* القائمة الجانبية */}
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
              onPress={() => switchpage(item, idx)}
              style={[
                styles.drawerItem,
                activeIndex === idx && styles.drawerItemActive,
              ]}
            >
              <Ionicons name={item.icon as any} size={20} color="#2563eb" />
              <Text style={styles.drawerItemText}>{item.label}</Text>
            </Pressable>
          ))}
        </AnimatedReanimated.View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  root: { marginRight: 10 },
  sidebar: {
    position: "relative",
    top: 24,
    left: 24,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#2563eb",
    height: "100%",
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
  logo: {
    height: 24,
    marginLeft: 8,
  },
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
    gap: 16 as any,
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
});

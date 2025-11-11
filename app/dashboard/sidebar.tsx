import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const MENU_ITEM_HEIGHT = 56;
const OPEN_WIDTH = 250;
const CLOSED_WIDTH = 80;

const menuItems = [
  { label: "Dashboard", icon: "speedometer-outline", route: "SuperAdmin/dashboard" },//finshied
  { label: "Stores Management", icon: "storefront-outline", route: "SuperAdmin/stores/StoreManagement" },//finshied
  { label: "Users Management", icon: "people-outline", route: "SuperAdmin/users/UserManagement" },//finshied
  { label: "Orders Management", icon: "receipt-outline", route: "SuperAdmin/orders/ordersManagement" },//finshied
  { label: "Sales Management", icon: "bar-chart-outline", route: "SuperAdmin/sales/salesManagement" },//finished
  { label: "Categories", icon: "grid-outline", route: "SuperAdmin/stores/categoriesManagement" },
  { label: "Reports", icon: "alert-circle-outline", route: "SuperAdmin/reports" },
  { label: "System Settings", icon: "settings-outline", route: "SuperAdmin/settings/systemSettings" },
];

const screenWidth = Dimensions.get("window").width;
const isMobile = screenWidth < 830;

export default function SuperAdminSidebar() {
  const [open, setOpen] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const indicatorY = useRef(new Animated.Value(0)).current;
  const widthAnim = useRef(new Animated.Value(OPEN_WIDTH)).current;

  const switchpage = (route: string, idx: number) => {
    setActiveIndex(idx);
    router.replace(route as any);
  };

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
            {showLabels && (
              <Image
                source={require("../../assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            )}
          </View>

          <View style={styles.menu}>
            <Animated.View
              pointerEvents="none"
              style={[styles.indicator, { transform: [{ translateY: indicatorY }] }]}
            />
            {menuItems.map((item, idx) => {
              const active = idx === activeIndex;
              return (
                <Pressable
                  key={item.label}
                  onPress={() => switchpage(item.route, idx)}
                  style={({ pressed }) => [
                    styles.item,
                    active && styles.itemActive,
                    pressed && styles.itemPressed,
                  ]}
                >
                  <Ionicons name={item.icon as any} size={22} color="#f9f9f9" />
                  {showLabels && (
                    <Text style={[styles.itemText, active && styles.itemTextActive]}>
                      {item.label}
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.upbar}>
        <View style={styles.upbarContent}>
          <Pressable onPress={() => setOpenDrawer(true)} style={styles.burgerBtn}>
            <Ionicons name="menu" size={28} color="#f9f9f9" />
          </Pressable>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.upbarLogo}
            resizeMode="contain"
          />
        </View>

        {openDrawer && (
          <View style={styles.overlay}>
            <Pressable style={styles.backdrop} onPress={() => setOpenDrawer(false)} />
            <Animated.View style={styles.drawer}>
              <View style={styles.drawerHeader}>
                <Text style={styles.drawerTitle}>القائمة</Text>
                <Pressable onPress={() => setOpenDrawer(false)}>
                  <Ionicons name="close" size={28} color="#f9f9f9" />
                </Pressable>
              </View>

              {menuItems.map((item, idx) => (
                <Pressable
                  key={item.label}
                  onPress={() => {
                    setActiveIndex(idx);
                    switchpage(item.route, idx);
                    setOpenDrawer(false);
                  }}
                  style={[
                    styles.drawerItem,
                    activeIndex === idx && styles.drawerItemActive,
                  ]}
                >
                  <Ionicons name={item.icon as any} size={22} color="#f9f9f9" />
                  <Text style={styles.drawerItemText}>{item.label}</Text>
                </Pressable>
              ))}
            </Animated.View>
          </View>
        )}
      </SafeAreaView>
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
    alignSelf: "stretch",
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
    backgroundColor: "#93c5fd",
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
  itemActive: { backgroundColor: "rgba(255,255,255,0.15)", opacity: 1 },
  itemText: { color: "#f9f9f9", fontSize: 16 },
  itemTextActive: { fontWeight: "600" },

  upbar: {
    backgroundColor: "#2563eb",
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    elevation: 4,
  },
  upbarContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 350,
  },
  upbarLogo: { height: 30, width: 100, marginHorizontal: 8 },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  backdrop: { flex: 1 },
  drawer: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: "#1e40af",
    paddingHorizontal: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  drawerTitle: { fontSize: 20, color: "#f9f9f9", fontWeight: "bold" },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
    opacity: 0.8,
  },
  drawerItemActive: { backgroundColor: "rgba(255,255,255,0.15)", opacity: 1 },
  drawerItemText: { color: "#f9f9f9", fontSize: 16, marginLeft: 10 },
});

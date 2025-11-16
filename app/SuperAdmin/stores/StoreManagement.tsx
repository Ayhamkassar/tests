import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
  Image,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import AnimatedReanimated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const students = [
  { id: '1', name: 'Eleanor Pena', roll: '#01', address: 'TA-107 Newyork', class: '01', dob: '02/05/2001', phone: '+123 8988567' },
  { id: '2', name: 'Jessia Rose', roll: '#10', address: 'TA-107 Newyork', class: '02', dob: '03/04/2000', phone: '+123 8988568' },
  { id: '3', name: 'Jenny Wilson', roll: '#05', address: 'Australia, Sydney', class: '02', dob: '12/05/2001', phone: '+123 8988566' },
  { id: '4', name: 'Guy Hawkins', roll: '#03', address: 'Australia, Sydney', class: '03', dob: '03/05/2001', phone: '+123 8988565' },
  { id: '5', name: 'Jacob Jones', roll: '#15', address: 'Australia, Sydney', class: '04', dob: '12/05/2001', phone: '+123 8988568' },
  { id: '6', name: 'Jane Cooper', roll: '#07', address: 'Australia, Sydney', class: '01', dob: '12/05/2001', phone: '+123 8988568' },
  { id: '7', name: 'Floyd Miles', roll: '#11', address: 'TA-107 Newyork', class: '01', dob: '03/05/2002', phone: '+123 8988569' },
];

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

export default function StudentList() {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const isMobile = width < 830;

  // sidebar state
  const [open, setOpen] = useState(true);
  const [activeIndex, setActiveIndex] = useState(1);
  const [openDrawer, setOpenDrawer] = useState(false);
  const indicatorY = useRef(new Animated.Value(activeIndex * MENU_ITEM_HEIGHT)).current;
  const widthAnim = useRef(new Animated.Value(OPEN_WIDTH)).current;
  const drawerX = useSharedValue(-260);

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

  return (
    <View style={[styles.container, { flexDirection: isMobile ? 'column' : 'row' }]}>
      {/* Sidebar for desktop */}
      {!isMobile && (
        <Animated.View style={[styles.sidebar, { width: widthAnim }]}>
          <View style={styles.header}>
            <Pressable onPress={() => setOpen((o) => !o)} style={styles.burgerBtn}>
              <Ionicons name="menu" size={24} color="#f9f9f9" />
            </Pressable>
          </View>
          <View style={styles.menu}>
            <Animated.View pointerEvents="none" style={[styles.indicator, { transform: [{ translateY: indicatorY }] }]} />
            {menuItems.map((item, idx) => {
              const active = idx === activeIndex;
              return (
                <Pressable
                  key={item.label}
                  onPress={() => switchpage(item.route, idx)}
                  style={({ pressed }) => [styles.item, active && styles.itemActive, pressed && styles.itemPressed]}
                >
                  <Ionicons name={item.icon as any} size={22} color="#f9f9f9" />
                  {open && <Text style={[styles.itemText, active && styles.itemTextActive]}>{item.label}</Text>}
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      )}

      {/* Drawer for mobile */}
      {isMobile && (
        <>
          <TouchableOpacity style={styles.menuBtn} onPress={toggleDrawer}>
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>
          {openDrawer && <TouchableOpacity style={styles.overlay} onPress={toggleDrawer} activeOpacity={1} />}
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
        </>
      )}

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Stores List</Text>
          <TouchableOpacity
            onPress={() => router.replace('/SuperAdmin/stores/addstore')}
            style={styles.addBtn}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addText}>Add Store</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Search by name or roll"
          placeholderTextColor="#999"
          style={styles.searchInput}
        />

        <ScrollView horizontal={isMobile}>
          <View style={[styles.tableHeader, { minWidth: isMobile ? 800 : '100%' }]}>
            <Text style={[styles.cell, styles.headerCell]}>STORE'S NAME</Text>
            <Text style={[styles.cell, styles.headerCell]}>OWNER</Text>
            <Text style={[styles.cell, styles.headerCell]}>TYPE</Text>
            <Text style={[styles.cell, styles.headerCell]}>CREATED AT</Text>
            <Text style={[styles.cell, styles.headerCell]}>STATUS</Text>
            <Text style={[styles.cell, styles.headerCell]}>PHONE</Text>
            <Text style={[styles.cell, styles.headerCell]}>EDIT / DELETE</Text>
          </View>
        </ScrollView>

        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onHoverIn={() => setHoveredRow(item.id)}
              onHoverOut={() => setHoveredRow(null)}
              style={[
                styles.row,
                hoveredRow === item.id && styles.rowHovered,
                { minWidth: isMobile ? 800 : '100%' },
              ]}
            >
              <Text style={styles.cell}>{item.name}</Text>
              <Text style={styles.cell}>{item.roll}</Text>
              <Text style={styles.cell}>{item.address}</Text>
              <Text style={styles.cell}>{item.class}</Text>
              <Text style={styles.cell}>{item.dob}</Text>
              <Text style={styles.cell}>{item.phone}</Text>

              <View style={styles.Btncell}>
                <Pressable
                  onHoverIn={() => setHoveredRow(item.id + '-edit')}
                  onHoverOut={() => setHoveredRow(null)}
                  style={[
                    styles.EditBtn,
                    hoveredRow === item.id + '-edit' && styles.btnHovered,
                  ]}
                >
                  <Text
                    style={[
                      styles.btnText,
                      hoveredRow === item.id + '-edit' && styles.btnTextHovered,
                    ]}
                  >
                    Edit
                  </Text>
                </Pressable>

                <View style={{ margin: 7 }} />

                <Pressable
                  onHoverIn={() => setHoveredRow(item.id + '-delete')}
                  onHoverOut={() => setHoveredRow(null)}
                  style={[
                    styles.DeleteBtn,
                    hoveredRow === item.id + '-delete' && styles.btnHovered,
                  ]}
                >
                  <Text
                    style={[
                      styles.btnText,
                      hoveredRow === item.id + '-delete' && styles.btnTextHovered,
                    ]}
                  >
                    Delete
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fb' },
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
  header: { height: 72, flexDirection: "row", alignItems: "center", paddingRight: 20 },
  burgerBtn: { width: 70, height: "100%", alignItems: "center", justifyContent: "center" },
  menu: { flex: 1 },
  indicator: { position: "absolute", left: 0, top: 0, height: MENU_ITEM_HEIGHT, width: 5, backgroundColor: "#6199f7", borderTopRightRadius: 4, borderBottomRightRadius: 4 },
  item: { height: MENU_ITEM_HEIGHT, paddingHorizontal: 22, flexDirection: "row", alignItems: "center", gap: 16, opacity: 0.6 },
  itemPressed: { backgroundColor: "rgba(0,0,0,0.2)" },
  itemActive: { backgroundColor: "rgba(0,0,0,0.08)", opacity: 1 },
  itemText: { color: "#f9f9f9", fontSize: 16 },
  itemTextActive: { fontWeight: "600" },
  menuBtn: { position: "absolute", top: 40, left: 20, zIndex: 20, backgroundColor: "#2563eb", padding: 10, borderRadius: 8 },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 9 },
  drawer: { position: "absolute", top: 0, left: 0, width: 250, height: "100%", backgroundColor: "#fff", paddingTop: 80, paddingHorizontal: 15, borderTopRightRadius: 20, borderBottomRightRadius: 20, zIndex: 10, elevation: 10 },
  drawerHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  drawerTitle: { fontSize: 18, fontWeight: "bold", color: "#2563eb" },
  drawerItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderRadius: 10, marginBottom: 8 },
  drawerItemActive: { backgroundColor: "#2563eb22" },
  drawerItemText: { color: "#000", fontSize: 16, marginLeft: 10 },
  content: { flex: 1, padding: 20 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '800', color: '#2563eb' },
  addBtn: { backgroundColor: '#2563eb', flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  addText: { color: '#fff', fontWeight: '600', marginLeft: 5 },
  searchInput: { marginTop: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e6eefc', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, fontSize: 16, backgroundColor: '#fff', color: '#000' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#e6eefc', borderRadius: 12, padding: 12, marginBottom: 8 },
  row: { flexDirection: 'row', padding: 12, borderRadius: 12, marginBottom: 6, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e6eefc' },
  rowHovered: { backgroundColor: '#e0e7ff' },
  cell: { flex: 1, fontSize: 14, color: '#333' },
  Btncell: { flex: 1, flexDirection: 'row', justifyContent: 'center', marginLeft: 10 },
  EditBtn: { borderRadius: 10, borderWidth: 1, borderColor: '#2563eb', backgroundColor: '#fff', paddingVertical: 6, paddingHorizontal: 12 },
  DeleteBtn: { borderRadius: 10, borderWidth: 1, borderColor: '#2563eb', backgroundColor: '#fff', paddingVertical: 6, paddingHorizontal: 12 },
  btnHovered: { backgroundColor: '#2563eb' },
  btnText: { color: '#2563eb', fontWeight: '600' },
  btnTextHovered: { color: '#fff' },
  headerCell: { fontWeight: '700', color: '#2563eb', fontSize: 14 },
});

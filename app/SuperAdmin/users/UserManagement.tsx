import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
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
  Alert,
} from 'react-native';
import AnimatedReanimated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import axios from 'axios';

const MENU_ITEM_HEIGHT = 56;
const OPEN_WIDTH = 250;
const CLOSED_WIDTH = 80;

const menuItems = [
  { label: "Dashboard", icon: "speedometer-outline", route: "SuperAdmin/dashboard" },
  { label: "Stores", icon: "storefront-outline", route: "SuperAdmin/stores/StoreManagement" },
  { label: "Users", icon: "people-outline", route: "SuperAdmin/users/UserManagement" },
  { label: "Orders", icon: "receipt-outline", route: "SuperAdmin/orders/ordersManagement" },
  { label: "Sales", icon: "bar-chart-outline", route: "SuperAdmin/sales/salesManagement" },
  { label: "Categories", icon: "grid-outline", route: "SuperAdmin/categories/categoriesManagement" },
  { label: "Reports", icon: "alert-circle-outline", route: "SuperAdmin/reports" },
  { label: "Settings", icon: "settings-outline", route: "SuperAdmin/settings/systemSettings" },
];

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  hasAStore: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const { width } = Dimensions.get('window');
  const isMobile = width < 830;

  // Sidebar state
  const [open, setOpen] = useState(true);
  const [activeIndex, setActiveIndex] = useState(2); // Users tab active
  const [openDrawer, setOpenDrawer] = useState(false);

  const indicatorY = useRef(new Animated.Value(activeIndex * MENU_ITEM_HEIGHT)).current;
  const widthAnim = useRef(new Animated.Value(OPEN_WIDTH)).current;
  const drawerX = useSharedValue(-260);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://localhost:7084/api/user/all');
      setUsers(res.data);
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'فشل جلب المستخدمين');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Sidebar animations
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
    drawerX.value = withTiming(openDrawer ? -260 : 0, { duration: 300 });
    setOpenDrawer(!openDrawer);
  };

  const handleDelete = (id: number) => {
    Alert.alert('تأكيد', 'هل أنت متأكد من حذف هذا المستخدم؟', [
      { text: 'إلغاء' },
      {
        text: 'حذف',
        onPress: async () => {
          try {
            await axios.delete(`https://localhost:7084/api/user/${id}`);
            setUsers(prev => prev.filter(u => u.id !== id));
            Alert.alert('Success', 'تم حذف المستخدم');
          } catch (err) {
            console.log(err);
            Alert.alert('Error', 'فشل حذف المستخدم');
          }
        },
      },
    ]);
  };

  const filteredUsers = users.filter(u => u.fullName.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={[styles.container, { flexDirection: isMobile ? 'column' : 'row' }]}>
      {/* Sidebar Desktop */}
      {!isMobile && (
        <Animated.View style={[styles.sidebar, { width: widthAnim }]}>
          <View style={styles.sidebarHeader}>
            <Pressable onPress={() => setOpen(!open)} style={styles.burgerBtn}>
              <Ionicons name="menu" size={24} color="#fff" />
            </Pressable>
          </View>

          <View style={styles.menu}>
            <Animated.View
              pointerEvents="none"
              style={[styles.indicator, { transform: [{ translateY: indicatorY }] }]}
            />

            {menuItems.map((item, idx) => (
              <Pressable
                key={item.label}
                onPress={() => switchpage(item.route, idx)}
                style={[styles.item, idx === activeIndex && styles.itemActive]}
              >
                <Ionicons name={item.icon as any} size={22} color="#fff" />
                {open && <Text style={styles.itemText}>{item.label}</Text>}
              </Pressable>
            ))}
          </View>
        </Animated.View>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <>
          <TouchableOpacity style={styles.menuBtn} onPress={toggleDrawer}>
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>
          {openDrawer && <TouchableOpacity style={styles.overlay} onPress={toggleDrawer} />}
          <AnimatedReanimated.View style={[styles.drawer, animatedDrawerStyle]}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerHeaderText}>القائمة</Text>
              <Pressable onPress={toggleDrawer}>
                <Ionicons name="close" size={24} color="#2563eb" />
              </Pressable>
            </View>

            {menuItems.map((item, idx) => (
              <Pressable
                key={item.label}
                onPress={() => switchpage(item.route, idx)}
                style={[styles.drawerItem, idx === activeIndex && styles.drawerItemActive]}
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
          <Text style={styles.title}>Users Management</Text>
          <TouchableOpacity style={styles.addBtn}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addText}>Add User</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Search by name"
          placeholderTextColor="#999"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />

<ScrollView horizontal={isMobile} style={{ flex: 1 }}>
  <View>
    {/* Table Header */}
    <View style={[styles.tableHeader, { minWidth: isMobile ? 850 : "100%" }]}>
      <Text style={[styles.cell, styles.headerCell]}>Full Name</Text>
      <Text style={[styles.cell, styles.headerCell]}>Email</Text>
      <Text style={[styles.cell, styles.headerCell]}>Role</Text>
      <Text style={[styles.cell, styles.headerCell]}>Has Store</Text>
      <Text style={[styles.cell, styles.headerCell]}>Created At</Text>
      <Text style={[styles.cell, styles.headerCell]}>Actions</Text>
    </View>

    {/* Table Rows */}
    <FlatList
      data={filteredUsers}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Pressable
          onHoverIn={() => setHoveredRow(item.id.toString())}
          onHoverOut={() => setHoveredRow(null)}
          style={[
            styles.row,
            hoveredRow === item.id.toString() && styles.rowHovered,
            { minWidth: isMobile ? 850 : "100%" },
          ]}
        >
          <Text style={styles.cell}>{item.fullName}</Text>
          <Text style={styles.cell}>{item.email}</Text>
          <Text style={styles.cell}>{item.role}</Text>
          <Text style={styles.cell}>{item.hasAStore ? "Yes" : "No"}</Text>
          <Text style={styles.cell}>{new Date(item.createdAt).toLocaleDateString()}</Text>

          <View style={styles.cellBtns}>
            <Pressable style={styles.EditBtn}>
              <Text style={styles.btnText}>Edit</Text>
            </Pressable>

            <View style={{ width: 8 }} />

            <Pressable
              onPress={() => handleDelete(item.id)}
              style={styles.DeleteBtn}
            >
              <Text style={styles.btnTextDelete}>Delete</Text>
            </Pressable>
          </View>
        </Pressable>
      )}
    />
  </View>
</ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fb' },
  sidebar: { backgroundColor: '#2563eb', paddingTop: 30, height: '100%', borderRadius: 16, margin: 20 },
  sidebarHeader: { height: 70, paddingLeft: 20, justifyContent: 'center' },
  burgerBtn: { width: 50, height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  menu: { flex: 1 },
  item: { flexDirection: 'row', alignItems: 'center', height: MENU_ITEM_HEIGHT, gap: 16, paddingHorizontal: 22, opacity: 0.7 },
  itemActive: { backgroundColor: 'rgba(255,255,255,0.15)', opacity: 1 },
  itemText: { color: '#fff', fontSize: 16, fontWeight: '500' },
  indicator: { position: 'absolute', left: 0, width: 6, height: MENU_ITEM_HEIGHT, backgroundColor: '#fff', borderRadius: 4 },

  menuBtn: { position: 'absolute', top: 40, left: 20, zIndex: 10, backgroundColor: '#2563eb', padding: 10, borderRadius: 10 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 9 },
  drawer: { position: 'absolute', width: 260, height: '100%', backgroundColor: '#fff', paddingTop: 80, paddingHorizontal: 15, zIndex: 20 },
  drawerHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  drawerHeaderText: { fontSize: 18, fontWeight: '700', color: '#2563eb' },
  drawerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, marginBottom: 8 },
  drawerItemActive: { backgroundColor: '#e0ecff', borderRadius: 8 },
  drawerItemText: { marginLeft: 10, fontSize: 16, color: '#000' },

  content: { flex: 1, padding: 20 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: '#2563eb' },
  addBtn: { backgroundColor: '#2563eb', flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, alignItems: 'center' },
  addText: { color: '#fff', fontWeight: '600', marginLeft: 4 },
  searchInput: { marginTop: 10, marginBottom: 14, backgroundColor: '#fff', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', fontSize: 15 },

  tableHeader: { flexDirection: 'row', backgroundColor: '#e7efff', padding: 14, borderRadius: 12, marginBottom: 10 },
  headerCell: { fontWeight: '700', fontSize: 14, color: '#2563eb' },

  row: { flexDirection: 'row', padding: 14, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 8 },
  rowHovered: { backgroundColor: '#eef3ff' },
  cell: { flex: 1, fontSize: 14, color: '#333' },
  Btncell: { flex: 1, flexDirection: 'row', justifyContent: 'center' },
  EditBtn: { 
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#2563eb20", },
  DeleteBtn: {    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#ff3b3020", },
  cellBtns: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  btnText: { color: '#2563eb', fontWeight: '600' },
  btnTextDelete: {
    color: "#d62828",
    fontWeight: "600",
  },
});

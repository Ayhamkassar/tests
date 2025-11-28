// *** Improved UI Version ***
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
  FlatList,
  useWindowDimensions,
  Alert,
} from 'react-native';
import AnimatedReanimated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { getAllStores, updateStore, deleteStore } from '../../api\'s/api';
import axios from 'axios';

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
interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  hasAStore: boolean;
}
interface Store {
  id: number;
  name: string;
  user: User;
  phone: string;
  createdAt: string;
  type: string;
  status: string;
  userId: string;
}

export default function StudentList() {
  const [stores, setStores] = useState<Store[]>([]);
  const [search, setSearch] = useState('');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const isMobile = width < 830;

  // Sidebar State
  const [open, setOpen] = useState(true);
  const [activeIndex, setActiveIndex] = useState(1);
  const [openDrawer, setOpenDrawer] = useState(false);

  const indicatorY = useRef(new Animated.Value(activeIndex * MENU_ITEM_HEIGHT)).current;
  const widthAnim = useRef(new Animated.Value(OPEN_WIDTH)).current;

  const drawerX = useSharedValue(-260);

  useEffect(() => {
    axios.get("https://localhost:7084/api/Stores/all").then((res) => {
      setStores(res.data);
    });
  }, []);
  useEffect(() => {
    Animated.timing(indicatorY, {
      toValue: activeIndex * MENU_ITEM_HEIGHT,
      duration: 240,
      useNativeDriver: true,
    }).start();
  }, [activeIndex]);

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: open ? OPEN_WIDTH : CLOSED_WIDTH,
      duration: 260,
      useNativeDriver: false,
    }).start();
  }, [open]);

  const animatedDrawerStyle = useAnimatedStyle(() => ({
    left: drawerX.value,
  }));

  const switchpage = (route: string, idx: number) => {
    setActiveIndex(idx);
    if (route) router.replace(route as any);
    if (isMobile) {
      drawerX.value = withTiming(-260, { duration: 300 });
      setOpenDrawer(false);
    }
  };
  const fetchStores = async () => {
    try {
      const res = await getAllStores();
      setStores(res.data);
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'فشل جلب المتاجر');
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);


  const handleUpdate = async (store: Store) => {
    try {
      const res = await updateStore(store.id, store);
      setStores(prev => prev.map(s => (s.userId === store.userId ? res.data : s)));
      Alert.alert('Success', 'تم تعديل المتجر');
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'فشل تعديل المتجر');
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert('تأكيد', 'هل أنت متأكد من حذف هذا المتجر؟', [
      { text: 'إلغاء' },
      {
        text: 'حذف',
        onPress: async () => {
          try {
            await deleteStore(id);
            setStores(prev => prev.filter(s => s.id !== id));
            Alert.alert('Success', 'تم حذف المتجر');
          } catch (err) {
            console.log(err);
            Alert.alert('Error', 'فشل حذف المتجر');
          }
        },
      },
    ]);
  };

  const filteredStores = stores.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );
  const toggleDrawer = () => {
    drawerX.value = withTiming(openDrawer ? -260 : 0, { duration: 300 });
    setOpenDrawer(!openDrawer);
  };

  return (
    <View style={[styles.container, { flexDirection: isMobile ? "column" : "row" }]}>
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
                {open && <Text style={[styles.itemText]}>{item.label}</Text>}
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

          {openDrawer && (
            <TouchableOpacity style={styles.overlay} onPress={toggleDrawer} />
          )}

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
          placeholderTextColor="#aaa"
          style={styles.searchInput}
        />
<ScrollView horizontal={isMobile} style={{ flex: 1 }}>
  <View>
    {/* Table Header */}
    <View style={[styles.tableHeader, { minWidth: isMobile ? 850 : "100%" }]}>
      <Text style={[styles.cell, styles.headerCell]}>STORE'S NAME</Text>
      <Text style={[styles.cell, styles.headerCell]}>OWNER</Text>
      <Text style={[styles.cell, styles.headerCell]}>TYPE</Text>
      <Text style={[styles.cell, styles.headerCell]}>CREATED AT</Text>
      <Text style={[styles.cell, styles.headerCell]}>STATUS</Text>
      <Text style={[styles.cell, styles.headerCell]}>PHONE</Text>
      <Text style={[styles.cell, styles.headerCell]}>EDIT / DELETE</Text>
    </View>

    {/* Table Rows */}
    <FlatList
      data={filteredStores}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <Pressable
          onHoverIn={() => setHoveredRow(item.userId.toString())}
          onHoverOut={() => setHoveredRow(null)}
          style={[
            styles.row,
            hoveredRow === item.userId.toString() && styles.rowHovered,
            { minWidth: isMobile ? 850 : "100%" },
          ]}
        >
          <Text style={styles.cell}>{item.name}</Text>
          <Text style={styles.cell}>{item.user?.fullName || "—"}</Text>
          <Text style={styles.cell}>{item.type ?? "Store"}</Text>
          <Text style={styles.cell}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          <Text style={styles.cell}>{item.status ?? "Active"}</Text>
          <Text style={styles.cell}>{item.phone}</Text>


          <View style={styles.cellBtns}>
            <Pressable onPress={()=> handleUpdate(item)} style={styles.EditBtn}>
              <Text style={styles.btnText}>Edit</Text>
            </Pressable>

            <View style={{ width: 8 }} />

            <Pressable
            onPress={() => handleDelete(item.id)}
            style={styles.DeleteBtn}>
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

// ------------------- STYLES -------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6fb",
  },

  /* Sidebar */
  sidebar: {
    backgroundColor: "#2563eb",
    paddingTop: 30,
    height: "100%",
    borderRadius: 20,
    margin: 20,
    overflow: "hidden",
    elevation: 5,
  },

  sidebarHeader: {
    height: 70,
    paddingLeft: 20,
    justifyContent: "center",
  },

  burgerBtn: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  menu: { flex: 1 },

  item: {
    flexDirection: "row",
    alignItems: "center",
    height: MENU_ITEM_HEIGHT,
    gap: 16,
    paddingHorizontal: 22,
    opacity: 0.7,
  },

  itemActive: {
    backgroundColor: "rgba(255,255,255,0.15)",
    opacity: 1,
  },

  itemText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },

  indicator: {
    position: "absolute",
    left: 0,
    width: 6,
    height: MENU_ITEM_HEIGHT,
    backgroundColor: "#fff",
    borderRadius: 4,
  },

  /* Mobile Drawer */
  menuBtn: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: "#2563eb",
    padding: 10,
    borderRadius: 10,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 9,
  },

  drawer: {
    position: "absolute",
    width: 260,
    height: "100%",
    backgroundColor: "#fff",
    paddingTop: 80,
    paddingHorizontal: 15,
    elevation: 10,
    zIndex: 20,
  },

  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  drawerHeaderText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563eb',
  },  
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 8,
  },

  drawerItemActive: {
    backgroundColor: "#e0ecff",
    borderRadius: 8,
  },

  drawerItemText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#000",
  },

  /* Content */
  content: {
    flex: 1,
    padding: 20,
  },

  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2563eb",
  },

  addBtn: {
    backgroundColor: "#2563eb",
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
  },

  addText: { color: "#fff", fontWeight: "600", marginLeft: 4 },

  searchInput: {
    marginTop: 10,
    marginBottom: 14,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    fontSize: 15,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e7efff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },

  headerCell: {
    fontWeight: "700",
    fontSize: 14,
    color: "#2563eb",
  },

  row: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 8,
    elevation: 1,
  },

  rowHovered: { backgroundColor: "#eef3ff" },

  cell: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },

  cellBtns: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },

  EditBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#2563eb20",
  },

  DeleteBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#ff3b3020",
  },

  btnText: {
    color: "#2563eb",
    fontWeight: "600",
  },

  btnTextDelete: {
    color: "#d62828",
    fontWeight: "600",
  },
});

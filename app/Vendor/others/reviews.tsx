import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from "react-native-reanimated";
import { router } from "expo-router";
import VendorsSideBar from "../../dashboard/vendorsSideBar";
import styles, { screenWidth } from "../../styles/reviewStyles";
import { initialReviews, menuItems } from "../../Data/reviewsData";

const Reviews: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(3);
  const [reviews, setReviews] = useState(initialReviews);

  const drawerX = useSharedValue(-260);
  const toggleDrawer = () => {
    drawerX.value = withTiming(drawerOpen ? -260 : 0, { duration: 300 });
    setDrawerOpen(!drawerOpen);
  };
  const animatedDrawerStyle = useAnimatedStyle(() => ({ left: drawerX.value }));

  const deleteReview = (id: string) => setReviews(reviews.filter(r => r.id !== id));

  const isDesktop = screenWidth >= 1024;

  return (
    <View style={styles.screen}>
      {isDesktop ? (
        <VendorsSideBar />
      ) : (
        <>
          <TouchableOpacity style={styles.menuBtn} onPress={toggleDrawer}>
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>
          {drawerOpen && <TouchableOpacity style={styles.overlay} onPress={toggleDrawer} />}
          <Animated.View style={[styles.drawer, animatedDrawerStyle]}>
            <Text style={styles.drawerTitle}>القائمة</Text>
            {menuItems.map((item: any, idx: any) => (
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
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.reviewCard}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={styles.customerName}>{item.customer}</Text>
                <View style={{ flexDirection: "row" }}>
                  {[...Array(5)].map((_, i) => (
                    <Ionicons key={i} name={i < item.rating ? "star" : "star-outline"} size={16} color="#facc15" />
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

export default Reviews;

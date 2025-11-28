import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FeatureCard from "./FeatureCard";

export default function LoginFeatures() {
  return (
    <View style={styles.leftPanel}>
      <Image source={require("../../../assets/images/logo.png")} style={styles.logo} />

      <Text style={styles.welcome}>مرحباً بك!</Text>
      <Text style={styles.desc}>سجّل دخولك للمتابعة إلى التطبيق</Text>

      <View style={styles.cards}>
        <View style={styles.row}>
          <FeatureCard
            Icon={Ionicons}
            title="متابعة الطلبات والمعاملات"
            description="إدارة الطلبات وتحديث حالتها بسهولة."
          />
          <FeatureCard
            Icon={Ionicons}
            title="إدارة المتجر والمنتجات"
            description="إضافة منتجات جديدة وتحديث الأسعار."
          />
        </View>

        <View style={styles.row}>
          <FeatureCard
            Icon={Ionicons}
            title="الإحصائيات والتقارير"
            description="تحليل المبيعات وقياس الأداء."
          />
          <FeatureCard
            Icon={FontAwesome6}
            title="التواصل مع العملاء"
            description="الدعم والرد على استفسارات العملاء."
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  leftPanel: {
    flex: 1,
    backgroundColor: "#2563eb",
    alignItems: "center",
    padding: 24,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 40,
  },
  welcome: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  desc: {
    color: "#dbeafe",
    textAlign: "center",
    fontSize: 15,
  },
  cards: {
    width: "100%",
    marginTop: 40,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
});

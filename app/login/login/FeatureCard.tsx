import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function FeatureCard({ Icon, title, description }: any) {
  return (
    <View style={styles.card}>
      <Icon size={24} color="rgb(255, 183, 0)" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 5,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 10,
    padding: 15,
    minHeight: 140,
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  desc: {
    color: "#fff",
    textAlign: "center",
    fontSize: 12,
  },
});

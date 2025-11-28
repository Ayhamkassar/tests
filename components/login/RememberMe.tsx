import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function RememberMe({ checked, onToggle }: any) {
  return (
    <Pressable style={styles.container} onPress={onToggle}>
      <Ionicons
        name={checked ? "checkbox" : "square-outline"}
        size={22}
        color="#007AFF"
      />
      <Text style={styles.text}>Remember me</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginVertical: 10,
  },
  text: {
    fontSize: 14,
    color: "#333",
  },
});

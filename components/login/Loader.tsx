import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";

export default function Loader({ size = "large", color = "#007AFF" }: any) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});

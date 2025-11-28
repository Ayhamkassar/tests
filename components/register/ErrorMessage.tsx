import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

export default ErrorMessage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fee2e2",
    borderColor: "#f87171",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  text: {
    color: "#dc2626",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
});

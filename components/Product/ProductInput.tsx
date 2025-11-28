import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

interface ProductInputProps {
  label: string;
  value: string;
  placeholder?: string;
  numeric?: boolean;
  multiline?: boolean;
  onChange: (value: string) => void;
}

const ProductInput: React.FC<ProductInputProps> = ({ label, value, placeholder, numeric, multiline, onChange }) => {
  return (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && { height: 100 }]}
        placeholder={placeholder}
        keyboardType={numeric ? "numeric" : "default"}
        multiline={multiline}
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  formGroup: { marginBottom: 15 },
  label: { fontSize: 14, color: "#000", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#2563eb",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    color: "#000",
    backgroundColor: "#fff",
  },
});

export default ProductInput;

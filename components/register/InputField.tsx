import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: any;
  secureTextEntry?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  secureTextEntry = false,
}) => {
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        textAlign="right"
      />
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 15,
    padding: 15,
    marginTop: 8,
    fontSize: 16,
    backgroundColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

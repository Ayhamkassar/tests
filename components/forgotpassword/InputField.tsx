import React from "react";
import { View, Text, TextInput } from "react-native";
import styles from "../../app/styles/forgotstyles";

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
}) => (
  <View style={styles.inputWrapper}>
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

export default InputField;

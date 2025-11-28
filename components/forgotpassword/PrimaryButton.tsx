import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styles from "../../app/styles/forgotstyles";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  type?: "primary" | "outline";
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ title, onPress, type = "primary" }) => (
  <TouchableOpacity style={type === "primary" ? styles.confirmBtn : styles.sendBtn} onPress={onPress}>
    <Text style={type === "primary" ? styles.confirmBtnText : styles.sendBtnText}>{title}</Text>
  </TouchableOpacity>
);

export default PrimaryButton;

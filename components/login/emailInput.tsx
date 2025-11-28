import React, { useState } from "react";
import { View, TextInput, Pressable, StyleSheet } from "react-native";

export default function EmailInput({ value, onChangeText, placeholder }: any) {
  const [hidden, setHidden] = useState(true);

  return (
    <View style={styles.wrapper}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType="email-address"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CCC",
    paddingHorizontal: 10,
    borderRadius: 10,
    height: 48,
    marginVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
});

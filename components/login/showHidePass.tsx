import React, { useState } from "react";
import { View, TextInput, Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function PasswordInput({ value, onChangeText, placeholder }: any) {
  const [hidden, setHidden] = useState(true);

  return (
    <View style={styles.wrapper}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={hidden}
        style={styles.input}
      />

      <Pressable onPress={() => setHidden(!hidden)}>
        <Ionicons
          name={hidden ? "eye-off-outline" : "eye-outline"}
          size={22}
          color="#555"
        />
      </Pressable>
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

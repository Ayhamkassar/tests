import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function LoginForm({
  email,
  password,
  setEmail,
  setPassword,
  onSubmit,
  errorMessage,
}: any) {
  return (
    <View style={styles.rightPanel}>
      {errorMessage && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      <Text style={styles.label}>البريد الإلكتروني</Text>
      <TextInput
        style={styles.input}
        placeholder="name@mail.com"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>كلمة المرور</Text>
      <TextInput
        style={styles.input}
        placeholder="********"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.loginBtn} onPress={onSubmit}>
        <Text style={styles.loginText}>تسجيل الدخول</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  rightPanel: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 50,
    justifyContent: "center",
  },
  label: {
    marginTop: 12,
    marginBottom: 5,
    fontSize: 16,
    color: "#222",
    textAlign: "right",
  },
  input: {
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 15,
    padding: 12,
    fontSize: 16,
    textAlign: "right",
  },
  loginBtn: {
    backgroundColor: "#3b82f6",
    padding: 14,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  errorBox: {
    backgroundColor: "#fee2e2",
    borderColor: "#f87171",
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
  },
  errorText: {
    textAlign: "center",
    color: "#dc2626",
    fontSize: 14,
  },
});

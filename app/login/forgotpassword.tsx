import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, View, Text } from "react-native";
import ResponsiveWrapper from "../../components/ResponsiveWrapper";
import InputField from "../../components/forgotpassword/InputField";
import PrimaryButton from "../../components/forgotpassword/PrimaryButton";
import styles from "../styles/forgotstyles";

const { width } = Dimensions.get("window");

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleConfirm = () => {
    // استدعاء API لتأكيد الرمز
  };

  const handleSendCode = () => {
    // استدعاء API لإرسال رمز التحقق
  };

  return (
    <LinearGradient colors={["#74ebd5", "#3b82f6"]} style={styles.gradient}>
      <ResponsiveWrapper>
        <View style={styles.container}>
          <Animated.View style={[styles.leftPanel, { opacity: fadeAnim, transform: [{ translateY }] }]}>
            <Text style={styles.welcome}>إرسال رمز التحقق</Text>
            <Text style={styles.desc}>
              ادخل بريدك الالكتروني ثم انقر على إرسال ليتم إرسال رمز التحقق
            </Text>
          </Animated.View>

          <Animated.View style={[styles.rightPanel, { opacity: fadeAnim, transform: [{ translateY }] }]}>
            <InputField label="البريد الالكتروني" value={email} onChangeText={setEmail} placeholder="أدخل بريدك الإلكتروني" keyboardType="email-address" />
            <InputField label="رمز التحقق" value={code} onChangeText={setCode} placeholder="أدخل رمز التحقق" keyboardType="numeric" />
            <PrimaryButton title="تأكيد" onPress={handleConfirm} />
            <PrimaryButton title="إرسال رمز التحقق" onPress={handleSendCode} type="outline" />
          </Animated.View>
        </View>
      </ResponsiveWrapper>
    </LinearGradient>
  );
}

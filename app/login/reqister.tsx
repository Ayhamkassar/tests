import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

import InputField from "../../components/register/InputField";
import ErrorMessage from "../../components/register/ErrorMessage";
import styles from "../styles/registerstyles";
import { registerUser } from "../services/userService";

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;
  const router = useRouter();

  const handleRegister = async () => {
    setErrorMessage(""); // تنظيف أي رسالة سابقة

    if (!fullName || !email || !password || !confirmPassword) {
      return setErrorMessage("يرجى ملء جميع الحقول");
    }
    if (password !== confirmPassword) {
      return setErrorMessage("كلمة المرور غير متطابقة");
    }

    try {
      await registerUser({ fullName, email, password, phone });
      router.push("/SuperAdmin/stores/addstore");
    } catch (error: any) {
      setErrorMessage(error.response?.data?.errors?.FullName?.[0] || "حدث خطأ أثناء التسجيل");
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <LinearGradient colors={["#74ebd5", "#3b82f6"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Animated.View style={[styles.rightPanel, { opacity: fadeAnim, transform: [{ translateY }] }]}>
            <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
            <Text style={styles.welcome}>مرحباً بك!</Text>
            <Text style={styles.desc}>أنشئ حساب للمتابعة إلى التطبيق</Text>
          </Animated.View>

          <Animated.View style={[styles.leftPanel, { opacity: fadeAnim, transform: [{ translateY }] }]}>
            <View style={styles.formContainer}>
              <ErrorMessage message={errorMessage} />

              <InputField label="اسم المستخدم" value={fullName} onChangeText={setFullName} placeholder="أدخل اسم المستخدم" />
              <InputField label="البريد الإلكتروني" value={email} onChangeText={setEmail} placeholder="أدخل بريدك الإلكتروني" keyboardType="email-address" />
              <InputField label="رقم الهاتف" value={phone} onChangeText={setPhone} placeholder="أدخل رقم هاتفك" keyboardType="phone-pad" />
              <InputField label="كلمة المرور" value={password} onChangeText={setPassword} placeholder="أدخل كلمة المرور" secureTextEntry />
              <InputField label="تأكيد كلمة المرور" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="أعد إدخال كلمة المرور" secureTextEntry />

              <TouchableOpacity style={styles.loginBtn} onPress={handleRegister}>
                <Text style={styles.loginText}>أنشئ حساب</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.registerBtn} onPress={() => router.push("/login/login/login")}>
                <Text style={styles.registerText}>لديك حساب؟ سجل دخول</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

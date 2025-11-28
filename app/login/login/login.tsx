import { useState, useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginFeatures from "./LoginFeatures";
import Loader from "../../../components/login/Loader";
import RememberMe from "../../../components/login/RememberMe";
import PasswordInput from "../../../components/login/showHidePass";
import EmailInput from "../../../components/login/emailInput";
import { loginRequest } from "../../services/authService";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("يرجى ملئ جميع الحقول");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const data = await loginRequest(email, password);
      const { token, userId, role, hasAStore } = data;

      await AsyncStorage.setItem("userId", String(userId));
      await AsyncStorage.setItem("authToken", token);

      if (remember) {
        await AsyncStorage.setItem("rememberMe", "true");
      }

      if (role === "Vendor") {
        router.push(hasAStore ? "./Vendor/dashboard/dashboard" : "./SuperAdmin/stores/addstore");
      } else if (role === "SuperAdmin") {
        router.push("./SuperAdmin/dashboard");
      }

    } catch (e: any) {
      setErrorMessage(e?.response?.data?.message || "حدث خطأ ما");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <LinearGradient colors={["#74ebd5", "#3b82f6"]} style={{ flex: 1 }}>
      <View style={styles.container}>

        <Animated.View style={[styles.leftPanel, { opacity: fadeAnim }]}>
          <LoginFeatures />
        </Animated.View>

        <Animated.View style={[styles.rightPanel, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={{ padding: 40 }}>
            
            <EmailInput
              value={email}
              onChangeText={setEmail}
              placeholder="البريد الإلكتروني"
            />

            <PasswordInput
              value={password}
              onChangeText={setPassword}
              placeholder="كلمة المرور"
            />


            {/* Remember Me */}
            <RememberMe
              checked={remember}
              onToggle={() => setRemember(!remember)}
            />

            {/* Error Message */}
            {errorMessage ? (
              <View style={{ backgroundColor: "#fee2e2", padding: 10, borderRadius: 10, marginVertical: 10 }}>
                <Animated.Text style={{ color: "#dc2626", textAlign: "center" }}>
                  {errorMessage}
                </Animated.Text>
              </View>
            ) : null}

            {/* Loader */}
            {loading && <Loader />}

            {/* Login Button */}
            <View style={{ marginTop: 20 }}>
              <Animated.View>
                <Animated.Text
                  style={{
                    textAlign: "center",
                    backgroundColor: "#3b82f6",
                    color: "#fff",
                    padding: 14,
                    borderRadius: 15,
                    fontWeight: "bold",
                  }}
                  onPress={handleLogin}
                >
                  تسجيل الدخول
                </Animated.Text>
              </Animated.View>
            </View>

          </View>
        </Animated.View>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: width < 1024 ? "column" : "row-reverse",
  },
  leftPanel: {
    flex: 1,
    backgroundColor: "#2563eb", // solid blue
    justifyContent: "center",   // مركز العناصر عمودياً
    alignItems: "center",       // مركز العناصر أفقياً
    padding: 24,
  },
  rightPanel: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",   // solid white
    padding: 40,
  },
});

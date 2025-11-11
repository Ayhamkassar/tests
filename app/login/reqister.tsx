import axios from "axios";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const {width,height} = Dimensions.get('window');


export default function LoginScreen() {
    const [username, setUsername] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [phone,setPhone] = useState('');
  const fadeanimation = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;
  const router = useRouter();
  
  const handleregister = async () => {
    if (username == '' || Email == '' || Password == '' || confirmPassword == '') {
      setErrorMessage('يرجى ملئ جميع الحقول');
      return;
    }
    
    if (Password !== confirmPassword) {
      setErrorMessage('كلمة المرور غير متطابقة');
      return;
    }
    
    try {
        const res = await axios.post("https://localhost:7109/api/AuthApi/RegisterWeb", {
            fullname : username,
            email : Email,
            password : Password,
            phoneNumber : phone
        })
        router.push('/login/login')
    } catch (error) {
      setErrorMessage('حدث خطأ أثناء التسجيل');
      console.log(error)
    }
  }

  useEffect(() => {
    Animated.parallel([
    Animated.timing(fadeanimation, {
      toValue : 1,
      duration : 1000,
      useNativeDriver : true,
    }),
    Animated.timing(translateY,{
      toValue:0,
      duration:800,
      useNativeDriver : true,
    })
  ]).start();
  },[])
  return (
    <LinearGradient
    colors={["#74ebd5", "#3b82f6"]} 
    style={styles.gradient}
  >
      <ScrollView 
        style={styles.scrollcontainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        keyboardShouldPersistTaps="handled"
      >
    <View style={styles.container}>
      <Animated.View style={[styles.rightPanel,{opacity : fadeanimation, transform : [{translateY}]}]}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.welcome}>مرحباً بك!</Text>
        <Text style={styles.desc}>انشئ حساب للمتابعة إلى التطبيق</Text>
      </Animated.View>

      <Animated.View 
      style={[
        styles.leftPanel,
        {opacity : fadeanimation
        ,transform : [{translateY}]
        },
        ]}>
        <View style={styles.formContainer}>
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}
          
          <Text style={styles.label}>اسم المستخدم</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="أدخل اسم المستخدم"
            placeholderTextColor="#94a3b8"
          />

          <Text style={styles.label}>البريد الإلكتروني</Text>
          <TextInput
            style={styles.input}
            value={Email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="أدخل بريدك الإلكتروني"
            placeholderTextColor="#94a3b8"
          />
                    <Text style={styles.label}>رقم الهاتف</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="أدخل رقم هاتفك"
            placeholderTextColor="#94a3b8"
          />

          <Text style={styles.label}>كلمة المرور</Text>
          <TextInput
            style={styles.input}
            value={Password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="أدخل كلمة المرور"
            placeholderTextColor="#94a3b8"
          />
          
          <Text style={styles.label}>تأكيد كلمة المرور</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder="أعد إدخال كلمة المرور"
            placeholderTextColor="#94a3b8"
          />
          
          <TouchableOpacity
          onPress={handleregister}
           style={styles.loginBtn}>
            <Text style={styles.loginText}>انشئ حساب</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.registerBtn}
            onPress={() => router.push('/login/login')}
          >
            <Text style={styles.registerText}>لديك حساب؟ سجل دخول</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
    </ScrollView>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  scrollcontainer : {
    flex : 1,
    backgroundColor: '#2563eb',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    flexDirection: width < 1024 ? 'column' : 'row-reverse',
  },
  leftPanel: {
    flex: 1,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    padding: 24,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 24,
    borderRadius: 40,
  },
  welcome: {
    color: '#2563eb',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  desc: {
    color: '#2563eb',
    fontSize: 16,
    textAlign: 'center',
  },
  rightPanel: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 40,
    justifyContent: 'center',
    alignItems : 'center',
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    marginTop: 25,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f1f5f9',
    textAlign : 'right',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginBtn: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  forgotpasswordText : {
    color: '#3b82f6',
    fontSize: 16,
    textDecorationLine : 'underline'
  },
  loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gradient: {
    flex: 1
  },
  cards: {
    flex : 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingTop : height < 1342 && width < 1024? 600 : 0,
  },
  lowercards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  uppercards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  shoppingcard: {
    flex: 1,
    margin: 5,
    borderColor: 'rgba(0,0,0,1)',
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    padding: 15,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  maintext: {
    color: '#fff',
    padding: 10,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: 'center',
  },
  subtext : {
    color : 'white'
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderColor: '#f87171',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  registerBtn : {
    backgroundColor: 'transparent',
    borderColor : '#fff',
    borderWidth: 2,
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 16,
  },
  registerText : {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
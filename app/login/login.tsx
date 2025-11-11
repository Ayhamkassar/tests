import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import  { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const {width,height} = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const[errorMessage,setErrorMessage] = useState('')
  const fadeanimation = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;
  const router = useRouter();
  const handlelogin = async () => {
    if (!email || !password){
      setErrorMessage('يرجى ملئ جميع الحقول')
      return;
    }else{
      try {
        const res = await axios.post('https://localhost:7109/api/AuthApi/LoginWeb',{
          email : email,
          password : password
        })
        const token = res.data.token;

        await AsyncStorage.setItem('userId', res.data);
        await AsyncStorage.setItem('authToken', token);

        
        router.push('/dashboard/dashboard')
        return;
    } catch (error) { 
      setErrorMessage('حدث خطأ ما')
      console.log(error)
      return;
    }}
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
  <View style={styles.container}>
    <Animated.View style={[styles.leftPanel,{opacity : fadeanimation}]}>
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.welcome}>مرحباً بك!</Text>
      <Text style={styles.desc}>سجّل دخولك للمتابعة إلى التطبيق</Text>
      <View style={styles.cards}>
    <View style={styles.uppercards}>
      <View style={styles.shoppingcard}>
        <Ionicons name="storefront" size={24} color="rgb(255, 183, 0)" />
        <Text style={styles.maintext}>متابعة الطلبات والمعاملات</Text>
        <Text style={styles.subtext}>لديك إمكانية عرض الطلبات الجديدة، تأكيدها، تحديث حالتها، وإدارة عمليات الدفع والشحن.</Text>
      </View>
      <View style={styles.shoppingcard}>
      <Ionicons name="stats-chart" size={24} color="rgb(255, 183, 0)" />
      <Text style={styles.maintext}>إدارة المتجر والمنتجات</Text>
      <Text style={styles.subtext}>يمكنك إنشاء وتعديل بيانات متجرك، إضافة منتجات جديدة، وتحديث الأسعار والمخزون بسهولة.</Text>
      </View>
    </View>
    <View style={styles.lowercards}>
      <View style={styles.shoppingcard}>
      <Ionicons name="logo-dropbox" size={24} color="rgb(255, 183, 0)" />
      <Text style={styles.maintext}>مراجعة الأداء وتقارير المبيعات</Text>
      <Text style={styles.subtext}>يمكنك الاطلاع على إحصائيات متجرك، تحليل المبيعات,وتحديد أفضل المنتجات لتحسين استراتيجية البيع.</Text>
      </View>
      <View style={styles.shoppingcard}>
      <FontAwesome6 name="users" size={24} color="rgb(255, 183, 0)" />
      <Text style={styles.maintext}>التواصل مع الزبائن</Text>
      <Text style={styles.subtext}>تستطيع الرد على الاستفسارات، تقديم الدعم للعملاء،وإرسال العروض الترويجية لتعزيز المبيعات.</Text>
      </View>
    </View>
    </View>
    </Animated.View>

    <Animated.View 
    style={[
      styles.rightPanel,
      {opacity : fadeanimation
      ,transform : [{translateY}]
      },
      ]}>
      <Text style={styles.label}>البريد الإلكتروني</Text>
      <TextInput
        style={styles.input}
        placeholder="name@mail.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text style={styles.label}>كلمة المرور</Text>
      <TextInput
        style={styles.input}
        placeholder="كلمة المرور"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity onPress={handlelogin} style={styles.loginBtn}>
        <Text style={styles.loginText}>تسجيل الدخول</Text>
      </TouchableOpacity>

    </Animated.View>
  </View>
  </LinearGradient>
);
}


const styles = StyleSheet.create({
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
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderColor: '#f87171',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 24,
    borderRadius: 40,
  },
  welcome: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  desc: {
    color: '#e0e7ef',
    fontSize: 16,
    textAlign: 'center',
  },
  rightPanel: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 90,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    color: '#222',
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 15,
    padding: 10,
    marginBottom: 8,
    fontSize: 16,
    backgroundColor: '#f1f5f9',
    textAlign : 'right',
  },
  loginBtn: {
    backgroundColor: '#3b82f6',
    padding: 14,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 16,
  },
  forgotpasswordText : {
    color: '#3b82f6',
    fontSize: 16,
    textDecorationLine : 'underline'
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gradient: {
    flex: 1,
    flexWrap: 'wrap'
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
  registerBtn : {
    backgroundColor: '#fff',
    borderColor : '#3b82f6',
    borderWidth : 2,
    padding: 14,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 16,
  },
  registerText : {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
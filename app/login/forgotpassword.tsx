import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ResponsiveWrapper from '../../components/ResponsiveWrapper';

const {width,height} = Dimensions.get('window');
function handleconfirming() {
  try {
    
  } catch (error) {
    
  }
}
export default function forgotpassword() {
   const [email,setEmail] = useState('');
   const [code,setCode] = useState('');
    const fadeanimation = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(40)).current;

  
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
    <ResponsiveWrapper>
      <View style={styles.container}>
    <Animated.View style={[styles.leftPanel,{opacity : fadeanimation, transform : [{translateY}]}]}>
      <View style={{width :300}}>
      <LottieView style={{flex : 1}} source={require('../../components/Email successfully sent.json')} autoPlay />
      </View>
        <Text style={styles.welcome}>إرسال رمز التحقق</Text>
        <Text style={styles.desc}> ادخل بريدك الالكتروني ثم انقر على ارسال ليتم إرسال رمز التحقق</Text>
      </Animated.View>
    <Animated.View 
    style={[
      styles.rightPanel,
      {opacity : fadeanimation
      ,transform : [{translateY}]
      },
      ]}>
      <Text style={styles.label}>البريد الالكتروني</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="أدخل بريدك الإلكتروني"
        placeholderTextColor="#94a3b8"
        keyboardType="email-address"
      />
      <Text style={styles.label}>رمز التحقق</Text>
      <TextInput
        style={styles.input}
        value={code}
        onChangeText={setCode}
        placeholder="أدخل رمز التحقق"
        placeholderTextColor="#94a3b8"
        keyboardType="numeric"
      />
      <TouchableOpacity
      onPress={handleconfirming}
       style={styles.confirmBtn}>
        <Text style={styles.confirmBtnText}>
            تأكيد
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sendBtn}>
        <Text style={styles.sendBtnText}>
            إرسال رمز التحقق
        </Text>
      </TouchableOpacity>
    </Animated.View>
    </View>
    </ResponsiveWrapper>
    </LinearGradient>
  )
}


const styles = StyleSheet.create({
    gradient : {
        flex : 1
    },
    sendBtn : {
      backgroundColor: 'transparent',
      borderColor: '#2563eb',
      borderWidth: 2,
      padding: 14,
      borderRadius: 15,
      alignItems: 'center',
      marginTop: 16,
    },
    sendBtnText : {
      color: '#2563eb',
      fontSize: 16,
      fontWeight: 'bold',
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
      justifyContent: 'center',
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
      marginBottom: 8,
      marginTop: 16,
      fontWeight: '500',
    },
    input: {
      borderWidth: 1,
      borderColor: '#cbd5e1',
      borderRadius: 15,
      padding: 15,
      marginBottom: 8,
      fontSize: 16,
      backgroundColor: '#f1f5f9',
      textAlign : 'right',
    },
    forgotpasswordText : {
      color: '#3b82f6',
      fontSize: 16,
      textDecorationLine : 'underline'
    },
    confirmBtn: {
        backgroundColor: '#3b82f6',
        padding: 14,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 16,
      },
      confirmBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      },
  });
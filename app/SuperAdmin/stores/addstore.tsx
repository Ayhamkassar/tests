import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

export default function AddStoreScreen({ navigation }: { navigation: any }) {
  const [owner, setOwner] = useState('');
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ visible: false, message: '' });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const cardAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    // animation fade-in and slide-up
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start();

    // انيميشن متدرج للعناصر
    const animateCards = () => {
      cardAnimations.forEach((anim, index) => {
        Animated.timing(anim, {
          toValue: 1,
          duration: 300,
          delay: index * 100,
          useNativeDriver: true,
        }).start();
      });
    };

    setTimeout(animateCards, 200);

    (async () => {
      try {
        const storedName = await AsyncStorage.getItem('userName');
        if (storedName) setOwner(storedName);
      } catch (err) {
        console.warn('Error reading userName from AsyncStorage', err);
      }
    })();
    (async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) return;
    
        const res = await axios.get(`https://localhost:7084/api/User/${userId}`);
        if (res.data) {
          setOwner(res.data.fullName);
        }
    
      } catch (err) {
        console.warn("Error fetching user from server", err);
      }
    })();
    
  }, [fadeAnim, slideAnim, cardAnimations]);

  const openImagePicker = () => {
    const options: ImagePicker.ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: true,
      selectionLimit: 1,
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) return;

      if (response.errorCode) {
        const errorMessages: { [key: string]: string } = {
          'camera_unavailable': 'الكاميرا غير متاحة',
          'permission': 'ليس لديك صلاحية للوصول للمعرض',
          'others': 'حصل خطأ أثناء اختيار الصورة'
        };
        showSnack(errorMessages[response.errorCode] || errorMessages.others);
        return;
      }

      const asset = response.assets && response.assets[0];
      if (!asset) return;
      if (asset.base64 && asset.uri) {
        let base64String = asset.base64;
  
        if (asset.uri.endsWith('.png')) {
          base64String = `data:image/png;base64,${base64String}`;
        } else if (asset.uri.endsWith('.jpg') || asset.uri.endsWith('.jpeg')) {
          base64String = `data:image/jpeg;base64,${base64String}`;
        }
      }
      if (asset.base64) {
        setImageBase64(asset.base64);
        setLogoUri(asset.uri || null);
        showSnack('تم اختيار الصورة بنجاح');
      } else {
        showSnack('تعذر قراءة الصورة، حاول مرة أخرى');
      }
    });
  };

  const showSnack = (message: string) => {
    setSnack({ visible: true, message });
    setTimeout(() => setSnack({ visible: false, message: '' }), 3500);
  };

  const validate = () => {
    if (!owner || owner.trim() === '') {
      showSnack('حقل المالك لا يمكن أن يكون فارغاً');
      return false;
    }
    if (!storeName || storeName.trim() === '') {
      showSnack('حقل اسم المتجر لا يمكن أن يكون فارغاً');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
  
    setLoading(true);
  
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        showSnack('حدث خطأ: المستخدم غير مسجل');
        setLoading(false);
        return;
      }
  
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };
      if (token) headers.Authorization = `Bearer ${token}`;
  
      // التحقق إذا عنده متجر
      const checkStoreUrl = `https://localhost:7084/api/Store/ByUser/${userId}`;
      try {
        const existingStore = await axios.get(checkStoreUrl, { headers, timeout: 10000 });
        if (existingStore && existingStore.data) {
          showSnack('لديك متجر بالفعل ولا يمكنك إنشاء متجر آخر');
          setLoading(false);
          return;
        }
      } catch (err: any) {
        if (err.response && err.response.status !== 404) {
          // أي خطأ غير 404 (يعني غير موجود متجر) نعرضه
          showSnack('حدث خطأ أثناء التحقق من المتجر');
          setLoading(false);
          return;
        }
        // إذا 404 يعني ما عنده متجر => نكمل
      }
  
      const payload = {
        name: storeName.trim(),
        description: description ? description.trim() : '',
        logo: imageBase64 || 'test',
        userId: Number(userId),
        phone: phone
      };
  
      const addStoreUrl = `https://localhost:7084/api/Stores/create`;
      const res = await axios.post(addStoreUrl, payload, { headers, timeout: 30000 });
      console.log(payload)
      
      if (res && (res.status === 200 || res.status === 201)) {
        showSnack('تم إضافة المتجر بنجاح');
        const newStore = res.data;
        if (navigation && newStore) {
          navigation.replace('StoreDetail', { store: newStore });
        }
      } else {
        showSnack('فشل إضافة المتجر — حاول لاحقاً');
      }
    } catch (err: any) {
      console.warn('Error submitting store:', err);
      showSnack('حصل خطأ أثناء إرسال البيانات');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Animated.View style={[styles.headerCard, { 
          opacity: cardAnimations[0],
          transform: [{ translateY: cardAnimations[0].interpolate({
            inputRange: [0, 1],
            outputRange: [30, 0]
          })}]
        }]}>
          <Text style={styles.title}>إضافة متجر جديد</Text>
          <Text style={styles.subtitle}>عبي الحقول التالية ثم اضغط إضافة</Text>
        </Animated.View>

        <Animated.View style={[styles.card, { 
          opacity: cardAnimations[1],
          transform: [{ translateY: cardAnimations[1].interpolate({
            inputRange: [0, 1],
            outputRange: [30, 0]
          })}]
        }]}>
          <Text style={styles.label}>المالك</Text>
          <TextInput style={[styles.input, { backgroundColor: '#f0f0f0' }]} value={owner} onChangeText={setOwner} placeholder="اسم المالك" placeholderTextColor="#666" 
          editable={false}
/>
        </Animated.View>

        <Animated.View style={[styles.card, { 
          opacity: cardAnimations[2],
          transform: [{ translateY: cardAnimations[2].interpolate({
            inputRange: [0, 1],
            outputRange: [30, 0]
          })}]
        }]}>
          <Text style={styles.label}>اسم المتجر</Text>
          <TextInput style={styles.input} value={storeName} onChangeText={setStoreName} placeholder="مثال: متجر أيهم" placeholderTextColor="#666" />
        </Animated.View>

        <Animated.View style={[styles.card, { 
          opacity: cardAnimations[3],
          transform: [{ translateY: cardAnimations[3].interpolate({
            inputRange: [0, 1],
            outputRange: [30, 0]
          })}]
        }]}>
          <Text style={styles.label}>الوصف</Text>
          <TextInput style={[styles.input, styles.textarea]} multiline numberOfLines={4} value={description} onChangeText={setDescription} placeholder="وصف المتجر (اختياري)" placeholderTextColor="#666" />
          <Text style={styles.label}>رقم الهاتف</Text>
          <TextInput style={styles.input} 
          value={phone} 
          onChangeText={setPhone} 
          placeholder="رقم الهاتف للتواصل بين العميل و المتجر"  
          placeholderTextColor="#666" />
        </Animated.View>

        <Animated.View style={[styles.card, { 
          opacity: cardAnimations[4],
          transform: [{ translateY: cardAnimations[4].interpolate({
            inputRange: [0, 1],
            outputRange: [30, 0]
          })}]
        }]}>
          <Text style={styles.label}>شعار المتجر (JPG / PNG)</Text>
          {logoUri ? (
            <View style={styles.logoPreviewWrap}>
              <Image source={{ uri: logoUri }} style={styles.logoPreview} />
              <TouchableOpacity style={styles.removeBtn} onPress={() => { setLogoUri(null); setImageBase64(null); }}>
                <Text style={styles.removeBtnText}>إزالة</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadBtn} onPress={openImagePicker}>
              <Text style={styles.uploadBtnText}>اختيار شعار من المعرض</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        <Animated.View style={[styles.card, { 
          opacity: cardAnimations[5],
          transform: [{ translateY: cardAnimations[5].interpolate({
            inputRange: [0, 1],
            outputRange: [30, 0]
          })}]
        }]}>
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.submitBtnText}>إضافة المتجر</Text>}
          </TouchableOpacity>
        </Animated.View>

        {snack.visible && (
          <View style={styles.snackbar}>
            <Text style={styles.snackText}>{snack.message}</Text>
          </View>
        )}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 18, paddingBottom: 36 },
  headerCard: { marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', color: '#111' },
  subtitle: { color: '#444', marginTop: 6 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  label: { marginBottom: 8, fontWeight: '600', color: '#222' },
  input: {
    borderWidth: 1,
    borderColor: '#e6e6e6',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 15,
    color: '#111',
    backgroundColor: '#fafafa',
  },
  textarea: { minHeight: 96, textAlignVertical: 'top' },
  uploadBtn: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#cfd8ff',
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  uploadBtnText: { color: '#2563eb', fontWeight: '600' },
  logoPreviewWrap: { alignItems: 'center' },
  logoPreview: { width: 140, height: 140, borderRadius: 8, marginBottom: 8 },
  removeBtn: {
    backgroundColor: '#fff',
    borderColor: '#f00',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  removeBtnText: { color: '#f00', fontWeight: '600' },
  submitBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  snackbar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  snackText: { color: '#fff' },
});

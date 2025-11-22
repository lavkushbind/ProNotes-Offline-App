import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, StatusBar, Alert } from 'react-native';
import { AppContext } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hasBiometrics, setHasBiometrics] = useState(false);
  
  // Context se naya function 'loginWithBiometrics' nikala
  const { login, signup, loginWithBiometrics } = useContext(AppContext);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setHasBiometrics(compatible && enrolled);
    })();
  }, []);

  // --- BIOMETRIC LOGIN LOGIC ---
  const handleBiometricLogin = async () => {
    if (!username) {
        Alert.alert("Username Required", "Please enter your username first to use biometrics.");
        return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock ProNotes',
      fallbackLabel: 'Use Password'
    });

    if (result.success) {
        // Agar fingerprint sahi hai, to bina password ke login karo
        const success = await loginWithBiometrics(username);
        // Agar username galat tha (database me nahi tha)
        if (!success) {
            // Alert already context se aa jayega
        }
    }
  };

  const handleSubmit = () => {
    if (!username || !password) return alert('Fill fields');
    if (isLogin) login(username, password);
    else signup(username, password).then(s => s && setIsLogin(true));
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Ionicons name="finger-print" size={60} color="#4461F2" />
        <Text style={styles.title}>ProNotes</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.subHeader}>{isLogin ? 'Welcome Back' : 'New Account'}</Text>
        
        <TextInput 
            placeholder="Username" 
            placeholderTextColor="#666" 
            style={styles.input} 
            onChangeText={setUsername} 
            value={username}
            autoCapitalize="none"
        />
        
        <TextInput 
            placeholder="Password" 
            placeholderTextColor="#666" 
            style={styles.input} 
            onChangeText={setPassword} 
            value={password}
            secureTextEntry
        />

        <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
            <Text style={styles.btnText}>{isLogin ? "Unlock" : "Create"}</Text>
        </TouchableOpacity>

        {/* Sirf Login mode me Fingerprint dikhao */}
        {isLogin && hasBiometrics && (
            <TouchableOpacity style={styles.bioBtn} onPress={handleBiometricLogin}>
                <Ionicons name="finger-print" size={24} color="#4461F2" />
                <Text style={styles.bioText}>Login with Fingerprint</Text>
            </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={{marginTop: 20}}>
            <Text style={{color:'#888', textAlign:'center'}}>
                {isLogin ? "Create Account" : "Back to Login"}
            </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', padding: 20 },
  header: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 30, color: 'white', fontWeight: 'bold', marginTop: 10 },
  card: { backgroundColor: '#1c1c1e', padding: 25, borderRadius: 20 },
  subHeader: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: '#2c2c2e', color: 'white', padding: 15, borderRadius: 10, marginBottom: 15 },
  btn: { backgroundColor: '#4461F2', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  bioBtn: { flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop: 20, padding: 10, borderWidth: 1, borderColor: '#333', borderRadius: 10 },
  bioText: { color: '#4461F2', marginLeft: 10 }
});
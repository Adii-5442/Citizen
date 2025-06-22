import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors, typography} from '../utils/theme';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigators/AppNavigator';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Register'
>;

const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  console.log(API_URL)

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/register', {
        username,
        email,
        password,
      });
      const {token, user} = response.data;

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      navigation.replace('MainTabs');
    } catch (error: any) {
      console.log(error)
      const errorMessage =
        error.response?.data?.error || 'An unexpected error occurred.';
      Alert.alert('Registration Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Join the community and start making a difference.
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <MaterialIcons
            name="person"
            size={20}
            color={colors.textLight}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={colors.textLight}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons
            name="email"
            size={20}
            color={colors.textLight}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor={colors.textLight}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons
            name="lock"
            size={20}
            color={colors.textLight}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.textLight}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.visibilityToggle}>
            <MaterialIcons
              name={isPasswordVisible ? 'visibility' : 'visibility-off'}
              size={22}
              color={colors.textLight}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.registerButton, isLoading && styles.loadingButton]}
          onPress={handleRegister}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={styles.registerButtonText}>Sign Up</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}> Sign In</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    ...typography.h1,
    fontSize: 32,
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body,
    color: colors.textLight,
    textAlign: 'center',
    maxWidth: '80%',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    ...typography.body,
    color: colors.text,
  },
  visibilityToggle: {
    padding: 4,
  },
  registerButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loadingButton: {
    backgroundColor: colors.primary + '80',
  },
  registerButtonText: {
    ...typography.h2,
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    ...typography.body,
    color: colors.textLight,
  },
  loginText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default RegisterScreen; 
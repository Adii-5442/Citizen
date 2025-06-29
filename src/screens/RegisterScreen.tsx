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
import { useAuth } from '../context/AuthContext';

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Register'
>;

const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Username availability states
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [usernameChecked, setUsernameChecked] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState('');

  // Validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Validation functions
  const validateUsername = (text: string) => {
    if (!text.trim()) {
      return 'Username is required';
    }
    if (text.length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (text.length > 20) {
      return 'Username must be less than 20 characters';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(text)) {
      return 'Username can only contain letters, numbers, and underscores';
    }
    return '';
  };

  const validateEmail = (text: string) => {
    if (!text.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(text)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (text: string) => {
    if (!text) {
      return 'Password is required';
    }
    if (text.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (text.length > 50) {
      return 'Password must be less than 50 characters';
    }
    return '';
  };

  // Reset check if username changes
  const handleUsernameChange = (text: string) => {
    setUsername(text);
    setUsernameChecked(false);
    setUsernameAvailable(false);
    setUsernameError('');
    const validationError = validateUsername(text);
    if (validationError) {
      setUsernameError(validationError);
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    const validationError = validateEmail(text);
    setEmailError(validationError);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    const validationError = validatePassword(text);
    setPasswordError(validationError);
  };

  const handleUsernameBlur = async () => {
    const validationError = validateUsername(username);
    if (validationError) {
      setUsernameError(validationError);
      setUsernameAvailable(false);
      setUsernameChecked(false);
      return;
    }
    if (!username.trim()) {
      setUsernameError('Enter a username');
      setUsernameAvailable(false);
      setUsernameChecked(false);
      return;
    }
    setCheckingUsername(true);
    setUsernameError('');
    try {
      const res = await api.get(`/api/users/check-username?username=${encodeURIComponent(username.trim())}`);
      if (res.data.available) {
        setUsernameAvailable(true);
        setUsernameChecked(true);
        setUsernameError('');
      } else {
        setUsernameAvailable(false);
        setUsernameChecked(true);
        setUsernameError('Username is already taken');
      }
    } catch (e) {
      setUsernameAvailable(false);
      setUsernameChecked(false);
      setUsernameError('Could not check username');
      console.error(e)
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleRegister = async () => {
    // Validate all fields
    const usernameValidation = validateUsername(username);
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    if (usernameValidation) {
      setUsernameError(usernameValidation);
    }
    if (emailValidation) {
      setEmailError(emailValidation);
    }
    if (passwordValidation) {
      setPasswordError(passwordValidation);
    }

    if (usernameValidation || emailValidation || passwordValidation) {
      Alert.alert('Error', 'Please fix the validation errors.');
      return;
    }

    if (!username || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    // Only proceed if username is available
    if (!usernameAvailable) {
      Alert.alert('Error', usernameError || 'Username is not available.');
      return;
    }
    setIsLoading(true);
    try {
      console.log("registering user")
      const response = await api.post('/api/users/register', {
        username,
        email,
        password,
      });
      const {token, user} = response.data;

      // Use AuthContext login function instead of manually setting AsyncStorage
      await login(token, user);

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
        <View style={[styles.inputContainer, usernameChecked && (usernameAvailable ? styles.inputAvailable : styles.inputUnavailable)]}>
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
            onChangeText={handleUsernameChange}
            autoCapitalize="none"
            editable={!checkingUsername && !isLoading}
            onBlur={handleUsernameBlur}
          />
          {checkingUsername ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : usernameChecked ? (
            <MaterialIcons
              name={usernameAvailable ? 'check-circle' : 'cancel'}
              size={22}
              color={usernameAvailable ? colors.success : colors.error}
            />
          ) : null}
        </View>
        {usernameError ? (
          <Text style={styles.errorText}>{usernameError}</Text>
        ) : null}

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
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {emailError ? (
          <Text style={styles.errorText}>{emailError}</Text>
        ) : null}

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
            onChangeText={handlePasswordChange}
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
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}

        <TouchableOpacity
          style={[styles.registerButton, (isLoading || !usernameAvailable) && styles.loadingButton]}
          onPress={handleRegister}
          disabled={isLoading || !usernameAvailable}>
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
    fontWeight: '700',
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
    backgroundColor: colors.primary,
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
  inputAvailable: {
    borderColor: colors.success,
  },
  inputUnavailable: {
    borderColor: colors.error,
  },
  usernameError: {
    color: colors.error,
    marginLeft: 16,
    marginBottom: 8,
    fontSize: 13,
  },
  errorText: {
    color: colors.error,
    marginLeft: 16,
    marginBottom: 8,
    fontSize: 13,
  },
});

export default RegisterScreen; 
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, Platform} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import theme from '../utils/theme';
import LinearGradient from 'react-native-linear-gradient';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import PostRantScreen from '../screens/PostRantScreen';
import ActivityScreen from '../screens/ActivityScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PetitionGeneratedScreen from '../screens/PetitionGeneratedScreen';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RantDetailScreen from '../screens/RantDetailScreen';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  PostRant: undefined;
  PetitionGenerated: {rantId: string};
  RantDetail: {rant: any};
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  PostRant: undefined;
  Activity: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingTop: 10,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="PostRant"
        component={PostRantScreen}
        options={{
          tabBarIcon: () => (
            <LinearGradient
              colors={theme.colors.gradient}
              style={styles.centerButton}>
              <MaterialIcons name="add" size={32} color="#fff" />
            </LinearGradient>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="Activity"
        component={ActivityScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="notifications" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown:false,
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          contentStyle: {backgroundColor: '#FFFFFF'},
        }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="PostRant" component={PostRantScreen} />
        <Stack.Screen
          name="PetitionGenerated"
          component={PetitionGeneratedScreen}
        />
        <Stack.Screen name="RantDetail" component={RantDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: Platform.OS === 'ios' ? 25 : 20,
    shadowColor: theme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
});

export default AppNavigator;

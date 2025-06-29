import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StatusBar, Platform} from 'react-native';
import Toast from 'react-native-toast-message';
import 'react-native-url-polyfill/auto';

// Providers
import {AuthProvider} from './src/contexts/AuthContext';
import {ThemeProvider} from './src/contexts/ThemeContext';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import HomeScreen from './src/screens/home/HomeScreen';
import DashboardScreen from './src/screens/dashboard/DashboardScreen';
import UrlsScreen from './src/screens/urls/UrlsScreen';
import LinkTreesScreen from './src/screens/linktrees/LinkTreesScreen';
import QRCodesScreen from './src/screens/qrcodes/QRCodesScreen';
import PasswordsScreen from './src/screens/passwords/PasswordsScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import CreateUrlScreen from './src/screens/urls/CreateUrlScreen';
import CreateLinkTreeScreen from './src/screens/linktrees/CreateLinkTreeScreen';
import CreateQRCodeScreen from './src/screens/qrcodes/CreateQRCodeScreen';
import LinkTreeViewScreen from './src/screens/linktrees/LinkTreeViewScreen';

// Components
import TabBarIcon from './src/components/TabBarIcon';
import {useAuth} from './src/contexts/AuthContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => (
          <TabBarIcon name={route.name} focused={focused} color={color} size={size} />
        ),
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#111827',
          borderTopColor: '#374151',
          paddingBottom: Platform.OS === 'ios' ? 20 : 5,
          height: Platform.OS === 'ios' ? 85 : 60,
        },
        headerStyle: {
          backgroundColor: '#111827',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}>
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{title: 'Dashboard'}}
      />
      <Tab.Screen 
        name="URLs" 
        component={UrlsScreen}
        options={{title: 'My URLs'}}
      />
      <Tab.Screen 
        name="LinkTrees" 
        component={LinkTreesScreen}
        options={{title: 'Link Trees'}}
      />
      <Tab.Screen 
        name="QRCodes" 
        component={QRCodesScreen}
        options={{title: 'QR Codes'}}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{title: 'Profile'}}
      />
    </Tab.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="CreateUrl" component={CreateUrlScreen} />
      <Stack.Screen name="CreateLinkTree" component={CreateLinkTreeScreen} />
      <Stack.Screen name="CreateQRCode" component={CreateQRCodeScreen} />
      <Stack.Screen name="Passwords" component={PasswordsScreen} />
      <Stack.Screen name="LinkTreeView" component={LinkTreeViewScreen} />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  const {user, loading} = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

function App(): JSX.Element {
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#000000');
    }
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <AppNavigator />
        <Toast />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
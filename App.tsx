import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text, ActivityIndicator, View, TouchableOpacity } from 'react-native';

import EventsScreen from './src/screens/EventsScreen';
import TemplesScreen from './src/screens/TemplesScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoginScreen from './src/screens/LoginScreen';
import AdminDashboardScreen from './src/screens/admin/AdminDashboardScreen';
import AdminEventFormScreen from './src/screens/admin/AdminEventFormScreen';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { useNotifications } from './src/hooks/useNotifications';
import TempleDetailScreen from './src/screens/TempleDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  const { isAdmin } = useAuth();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#B45309',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          borderTopWidth: 0.5,
        },
      }}
    >
      <Tab.Screen
        name="Events"
        component={EventsScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>📅</Text> }}
      />
      <Tab.Screen
        name="Temples"
        component={TemplesScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>🛕</Text> }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>🔔</Text> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>👤</Text> }}
      />
      {isAdmin && (
        <Tab.Screen
          name="Admin"
          component={AdminDashboardScreen}
          options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>⚙️</Text> }}
        />
      )}
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user, loading } = useAuth();
  useNotifications();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#B45309" />
      </View>
    );
  }

  if (!user) return <LoginScreen />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="AddEvent" component={AdminEventFormScreen} />
      <Stack.Screen name="TempleDetail" component={TempleDetailScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
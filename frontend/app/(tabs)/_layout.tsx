import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';



export default function TabLayout() {
  const colorScheme = useColorScheme();
 
  return (
      <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => (
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(18, 18, 18, 0.95)', 
            }}
          />
        ),
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: 'transparent', 
            borderTopWidth: 0,
            elevation: 0, 
            shadowOpacity: 0, 
          },
          default: {
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="mushroom" size={24} color="white" />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <Ionicons name="map-outline" size={24} color="white" />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color }) => <Ionicons name="people-circle" size={24} color="white" />,
        }}
      />
        <Tabs.Screen
        name="general_info"
        options={{
          title: 'Info',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="information-outline" size={24} color="white" />,
        }}
      />
        <Tabs.Screen
        name="userProfile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person-circle-sharp" size={24} color="white" />,
        }}
      />
    </Tabs>
  );
}

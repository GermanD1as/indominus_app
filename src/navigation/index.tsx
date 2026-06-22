import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Colors } from '../constants/colors';
import { CatalogScreen } from '../screens/CatalogScreen';
import { ARScreen } from '../screens/ARScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ProductDetailScreen } from '../screens/ProductDetailScreen';

export type RootStackParamList = {
  Tabs: undefined;
  ProductDetail: { productId: string };
  AR: undefined;
};

export type TabParamList = {
  Catalog: undefined;
  AR: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabIcon({
  focused,
  icon,
  label,
}: {
  focused: boolean;
  icon: string;
  label: string;
}) {
  return (
    <View style={tabStyles.iconWrap}>
      <Text style={[tabStyles.iconText, focused && tabStyles.iconFocused]}>
        {icon}
      </Text>
      <Text style={[tabStyles.labelText, focused && tabStyles.labelFocused]}>
        {label}
      </Text>
    </View>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.tabBarBackground,
          borderTopColor: Colors.tabBarBorder,
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 84 : 64,
        },
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="Catalog"
        component={CatalogScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={'\u25A6'} label="Shop" />
          ),
        }}
      />
      <Tab.Screen
        name="AR"
        component={ARScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={'\u25C6'} label="Try On" />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={'\u25CC'} label="Settings" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: Colors.background },
        }}>
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen
          name="AR"
          component={ARScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const tabStyles = StyleSheet.create({
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  iconText: {
    fontSize: 22,
    color: Colors.textDim,
  },
  iconFocused: {
    color: Colors.primary,
  },
  labelText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textDim,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  labelFocused: {
    color: Colors.primary,
  },
});

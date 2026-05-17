import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../config';
import { MainTabParamList } from '../types';
import { HomeScreen } from '../screens/HomeScreen';
import { CartScreen } from '../screens/CartScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { AccountScreen } from '../screens/AccountScreen';
import { useCart } from '../context/CartContext';

const Stack = createNativeStackNavigator<MainTabParamList>();

type TabName = keyof MainTabParamList;

const tabs: Array<{ name: TabName; label: string }> = [
  { name: 'Home', label: 'Sản phẩm' },
  { name: 'Cart', label: 'Giỏ' },
  { name: 'Orders', label: 'Đơn' },
  { name: 'Chat', label: 'Chat' },
  { name: 'Account', label: 'Tôi' },
];

const screenMap = {
  Home: HomeScreen,
  Cart: CartScreen,
  Orders: OrdersScreen,
  Chat: ChatScreen,
  Account: AccountScreen,
};

export const MainTabs = () => {
  const { itemCount } = useCart();
  return (
    <Stack.Navigator
      screenOptions={({ route, navigation }) => ({
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { color: colors.text, fontWeight: '800' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
        headerTitle: tabs.find((tab) => tab.name === route.name)?.label,
        headerRight: () => (
          <View style={{ flexDirection: 'row', gap: 14 }}>
            {tabs.map((tab) => {
              const active = tab.name === route.name;
              const label = tab.name === 'Cart' && itemCount > 0 ? `${tab.label} (${itemCount})` : tab.label;
              return (
                <TouchableOpacity key={tab.name} onPress={() => navigation.navigate(tab.name as never)}>
                  <Text style={{ color: active ? colors.primary : colors.muted, fontWeight: '800', fontSize: 12 }}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ),
      })}
    >
      {tabs.map((tab) => (
        <Stack.Screen key={tab.name} name={tab.name} component={screenMap[tab.name]} />
      ))}
    </Stack.Navigator>
  );
};

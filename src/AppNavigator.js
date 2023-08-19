// In AppNavigator.js in a new project

import * as React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './screens/Home';
import Item from './screens/Item';
const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home"  component={Home} options={{headerShown: false}} />
        <Stack.Screen name="Item"  component={Item} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;

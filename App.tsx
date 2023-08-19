import {View, Text} from 'react-native';
import React from 'react';
import Home from './src/screens/Home';
import AppNavigator from './src/AppNavigator';
const App = () => {
  return (
    <View style={{flex:1}}>
      {/* <Text>App</Text> */}
      <AppNavigator />
    </View>
  );
};

export default App;

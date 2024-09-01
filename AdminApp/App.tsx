import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AdminNavigator from './src/navigation/AdminNavigator'; // Залежно від шляху до твоїх навігаторів

const App = () => {
  return (
    <NavigationContainer>
      <AdminNavigator />
    </NavigationContainer>
  );
};

export default App;
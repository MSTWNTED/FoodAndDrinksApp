import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ContinentSelectionScreen from '../screens/ContinentSelectionScreen'; // Імпортуємо новий екран
import CountrySelectionScreen from '../screens/CountrySelectionScreen';
import RecipeListScreen from '../screens/RecipeListScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import {Recipe} from '../types'; // Імпорт типу Recipe

type RootStackParamList = {
  Home: undefined;
  ContinentSelection: {type: 'food' | 'drink'};
  CountrySelection: {type: 'food' | 'drink'; continent: string};
  RecipeList: {type: 'food' | 'drink'; country: string};
  RecipeDetail: {recipe: Recipe};
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="ContinentSelection"
          component={ContinentSelectionScreen}
        />{' '}
        {/* Додаємо екран */}
        <Stack.Screen
          name="CountrySelection"
          component={CountrySelectionScreen}
        />
        <Stack.Screen name="RecipeList" component={RecipeListScreen} />
        <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

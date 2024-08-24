import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RecipeListScreen from '../screens/RecipeListScreen';
import RecipeDetailScreen, { RecipeDetailScreenProps } from '../screens/RecipeDetailScreen';

type AdminStackParamList = {
  RecipeList: undefined;
  RecipeDetail: { recipeId: string | null };
};

const Stack = createStackNavigator<AdminStackParamList>();

// Винесений компонент RecipeDetailWrapper за межі AdminNavigator
const RecipeDetailWrapper: React.FC<RecipeDetailScreenProps> = (props) => {
  return <RecipeDetailScreen {...props} />;
};

const AdminNavigator: React.FC = () => (
  <Stack.Navigator>
    <Stack.Screen name="RecipeList" component={RecipeListScreen} />
    <Stack.Screen
      name="RecipeDetail"
      component={RecipeDetailWrapper} // Використання винесеного компонента
    />
  </Stack.Navigator>
);

export default AdminNavigator;

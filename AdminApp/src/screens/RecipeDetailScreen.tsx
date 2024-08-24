import React from 'react';
import { View, StyleSheet, TextInput, Button, ActivityIndicator, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import axios from 'axios';

type AdminStackParamList = {
  RecipeList: undefined;
  RecipeDetail: { recipeId: string | null };
};

type RecipeDetailScreenNavigationProp = StackNavigationProp<AdminStackParamList, 'RecipeDetail'>;
type RecipeDetailScreenRouteProp = RouteProp<AdminStackParamList, 'RecipeDetail'>;

export type RecipeDetailScreenProps = {
  route: RecipeDetailScreenRouteProp;
  navigation: RecipeDetailScreenNavigationProp;
};

const RecipeDetailScreen: React.FC<RecipeDetailScreenProps> = ({ route }) => {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = React.useState({
    _id: '',
    name: '',
    cuisine: '',
    ingredients: '',
    instructions: '',
    imageUrl: '',
    type: 'food' as 'food' | 'drink',
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (recipeId) {
      axios.get(`http://localhost:3000/api/recipes/${recipeId}`)
        .then(response => {
          setRecipe(response.data);
          setLoading(false);
        })
        .catch(_error => {
          Alert.alert('Error', 'Failed to fetch recipe details');
          setLoading(false);
        });
    }
  }, [recipeId]);

  const handleSave = () => {
    // Function to handle recipe update or save
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={recipe.name}
        onChangeText={(text) => setRecipe({ ...recipe, name: text })}
        placeholder="Recipe Name"
      />
      <TextInput
        style={styles.input}
        value={recipe.cuisine}
        onChangeText={(text) => setRecipe({ ...recipe, cuisine: text })}
        placeholder="Cuisine"
      />
      <TextInput
        style={styles.input}
        value={recipe.ingredients}
        onChangeText={(text) => setRecipe({ ...recipe, ingredients: text })}
        placeholder="Ingredients"
      />
      <TextInput
        style={styles.input}
        value={recipe.instructions}
        onChangeText={(text) => setRecipe({ ...recipe, instructions: text })}
        placeholder="Instructions"
      />
      <TextInput
        style={styles.input}
        value={recipe.imageUrl}
        onChangeText={(text) => setRecipe({ ...recipe, imageUrl: text })}
        placeholder="Image URL"
      />
      <Button title="Save Recipe" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default RecipeDetailScreen;

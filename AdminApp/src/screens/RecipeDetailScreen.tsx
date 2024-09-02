import React from 'react';
import { View, StyleSheet, TextInput, Button, ActivityIndicator, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import axios from 'axios';
import { Picker as RNPicker } from '@react-native-picker/picker';

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

const RecipeDetailScreen: React.FC<RecipeDetailScreenProps> = ({ route, navigation }) => {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = React.useState({
    _id: '',
    name: '',
    cuisine: '',
    ingredients: '',  // Ініціалізуємо як рядок
    instructions: '',
    imageUrl: '',
    type: 'food' as 'food' | 'drink',  // Додаємо тип рецепту
  });
  const [loading, setLoading] = React.useState(!!recipeId);

  React.useEffect(() => {
    if (recipeId) {
      axios.get(`https://foodanddrinksapp.onrender.com/api/recipes/${recipeId}`)
        .then(response => {
          const fetchedRecipe = response.data;
          setRecipe({
            ...fetchedRecipe,
            ingredients: Array.isArray(fetchedRecipe.ingredients)
              ? fetchedRecipe.ingredients.join(', ')  // Перетворюємо масив у рядок для відображення
              : fetchedRecipe.ingredients || '', // Якщо це рядок або undefined
          });
          setLoading(false);
        })
        .catch(_error => {
          Alert.alert('Error', 'Failed to fetch recipe details');
          setLoading(false);
        });
    }
  }, [recipeId]);

  const handleSave = () => {
    if (!recipe.name || !recipe.cuisine || !recipe.ingredients || !recipe.instructions || !recipe.type) {
      Alert.alert('Error', 'Please fill out all required fields');
      return;
    }

    const updatedRecipe = {
      ...recipe,
      ingredients: typeof recipe.ingredients === 'string'
        ? recipe.ingredients.split(',').map(ingredient => ingredient.trim())
        : recipe.ingredients,  // Якщо інгредієнти вже масив, залишаємо як є
    };

    if (!recipeId) {
      delete updatedRecipe._id;
    }

    if (recipeId) {
      axios.put(`https://foodanddrinksapp.onrender.com/api/recipes/${recipeId}`, updatedRecipe)
        .then(_response => {
          Alert.alert('Success', 'Recipe updated successfully');
          navigation.navigate('RecipeList');
        })
        .catch(error => {
          console.error('Failed to update recipe:', error.response?.data || error.message);
          Alert.alert('Error', 'Failed to update recipe');
        });
    } else {
      axios.post('https://foodanddrinksapp.onrender.com/api/recipes', updatedRecipe)
        .then(_response => {
          Alert.alert('Success', 'Recipe added successfully');
          navigation.navigate('RecipeList');
        })
        .catch(error => {
          console.error('Failed to add recipe:', error.response?.data || error.message);
          Alert.alert('Error', 'Failed to add recipe');
        });
    }
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
        placeholderTextColor="#888"  // Темніший колір для заповнювача
      />
      <TextInput
        style={styles.input}
        value={recipe.cuisine}
        onChangeText={(text) => setRecipe({ ...recipe, cuisine: text })}
        placeholder="Cuisine"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        value={Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : recipe.ingredients}
        onChangeText={(text) => setRecipe({ ...recipe, ingredients: text })}
        placeholder="Ingredients"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        value={recipe.instructions}
        onChangeText={(text) => setRecipe({ ...recipe, instructions: text })}
        placeholder="Instructions"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        value={recipe.imageUrl}
        onChangeText={(text) => setRecipe({ ...recipe, imageUrl: text })}
        placeholder="Image URL"
        placeholderTextColor="#888"
      />
      <RNPicker
        selectedValue={recipe.type}
        style={styles.picker}
        onValueChange={(itemValue) => setRecipe({ ...recipe, type: itemValue })}
      >
        <RNPicker.Item label="Food" value="food" />
        <RNPicker.Item label="Drink" value="drink" />
      </RNPicker>
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
    color: '#000',  // Темний колір тексту
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
});

export default RecipeDetailScreen;

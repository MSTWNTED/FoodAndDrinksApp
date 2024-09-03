import React from 'react';
import { View, StyleSheet, TextInput, Button, ActivityIndicator, Alert, FlatList, TouchableOpacity, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import axios from 'axios';
import { Picker as RNPicker } from '@react-native-picker/picker';
import Autocomplete from 'react-native-autocomplete-input';

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

const continents = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Australia', 'Antarctica'];

const RecipeDetailScreen: React.FC<RecipeDetailScreenProps> = ({ route, navigation }) => {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = React.useState({
    _id: '',
    name: '',
    continent: 'Europe',  // Значення за замовчуванням
    cuisine: '',
    ingredients: '',
    instructions: '',
    description: '',
    imageUrl: '',
    type: 'food' as 'food' | 'drink',
  });
  const [loading, setLoading] = React.useState(!!recipeId);
  const [countries, setCountries] = React.useState<string[]>([]);
  const [query, setQuery] = React.useState('');

  React.useEffect(() => {
    if (recipeId) {
      axios.get(`https://foodanddrinksapp.onrender.com/api/recipes/${recipeId}`)
        .then(response => {
          const fetchedRecipe = response.data;
          setRecipe({
            ...fetchedRecipe,
            ingredients: Array.isArray(fetchedRecipe.ingredients)
              ? fetchedRecipe.ingredients.join(', ')
              : fetchedRecipe.ingredients || '',
          });
          setLoading(false);
        })
        .catch(_error => {
          Alert.alert('Error', 'Failed to fetch recipe details');
          setLoading(false);
        });
    }
  }, [recipeId]);

  React.useEffect(() => {
    axios.get('https://foodanddrinksapp.onrender.com/api/recipes/cuisines')
      .then(response => {
        setCountries(response.data);
      })
      .catch(_error => {
        Alert.alert('Error', 'Failed to fetch countries');
      });
  }, []);

  const handleSave = () => {
    if (!recipe.name || !recipe.continent || !recipe.cuisine || !recipe.ingredients || !recipe.instructions || !recipe.type || !recipe.imageUrl) {
      Alert.alert('Error', 'Please fill out all required fields');
      return;
    }

    const updatedRecipe = {
      ...recipe,
      ingredients: typeof recipe.ingredients === 'string'
        ? recipe.ingredients.split(',').map(ingredient => ingredient.trim())
        : recipe.ingredients,
    };

    if (!recipeId) {
      delete updatedRecipe._id;
    }

    const apiCall = recipeId
      ? axios.put(`https://foodanddrinksapp.onrender.com/api/recipes/${recipeId}`, updatedRecipe)
      : axios.post('https://foodanddrinksapp.onrender.com/api/recipes', updatedRecipe);

    apiCall
      .then(_response => {
        Alert.alert('Success', `Recipe ${recipeId ? 'updated' : 'added'} successfully`);
        navigation.navigate('RecipeList');
      })
      .catch(error => {
        console.error(`Failed to ${recipeId ? 'update' : 'add'} recipe:`, error.response?.data || error.message);
        Alert.alert('Error', `Failed to ${recipeId ? 'update' : 'add'} recipe`);
      });
  };

  const filteredCountries = query === ''
    ? []
    : countries.filter(country => country.toLowerCase().includes(query.toLowerCase()));

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
        placeholderTextColor="#888"
      />
      <RNPicker
        selectedValue={recipe.continent}
        style={styles.picker}
        onValueChange={(itemValue) => setRecipe({ ...recipe, continent: itemValue })}
      >
        {continents.map(continent => (
          <RNPicker.Item key={continent} label={continent} value={continent} />
        ))}
      </RNPicker>
      <Autocomplete
        data={filteredCountries}
        defaultValue={recipe.cuisine}
        onChangeText={(text) => {
          setQuery(text);
          setRecipe({ ...recipe, cuisine: text });
        }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setRecipe({ ...recipe, cuisine: item })}>
            <Text style={styles.itemText}>{item}</Text>
          </TouchableOpacity>
        )}
        placeholder="Country"
        inputContainerStyle={styles.autocompleteContainer}
        listContainerStyle={styles.listContainer}
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
        value={recipe.description}
        onChangeText={(text) => setRecipe({ ...recipe, description: text })}
        placeholder="Description"
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
    color: '#000', // Чорний колір тексту
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
    color: '#000', // Чорний колір тексту для Picker
  },
  autocompleteContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#000', // Чорний колір тексту
  },
  listContainer: {
    maxHeight: 150,
  },
  itemText: {
    padding: 10,
    fontSize: 16,
    color: '#000', // Чорний колір тексту для випадаючих елементів
  },
});


export default RecipeDetailScreen;

import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import axios from 'axios';
import {Picker as RNPicker} from '@react-native-picker/picker';

type AdminStackParamList = {
  RecipeList: undefined;
  RecipeDetail: {recipeId: string | null};
};

type RecipeDetailScreenNavigationProp = StackNavigationProp<
  AdminStackParamList,
  'RecipeDetail'
>;
type RecipeDetailScreenRouteProp = RouteProp<
  AdminStackParamList,
  'RecipeDetail'
>;

export type RecipeDetailScreenProps = {
  route: RecipeDetailScreenRouteProp;
  navigation: RecipeDetailScreenNavigationProp;
};

const continents = [
  'Africa',
  'Asia',
  'Europe',
  'North America',
  'South America',
  'Australia',
  'Antarctica',
];
const productTypes = ['food', 'drink'];

const RecipeDetailScreen: React.FC<RecipeDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const {recipeId} = route.params;
  const [recipe, setRecipe] = React.useState({
    _id: '',
    name: '',
    continent: 'Europe',
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
      axios
        .get(`https://foodanddrinksapp.onrender.com/api/recipes/${recipeId}`)
        .then(response => {
          const fetchedRecipe = response.data;
          setRecipe({
            ...fetchedRecipe,
            ingredients: Array.isArray(fetchedRecipe.ingredients)
              ? fetchedRecipe.ingredients.join(', ')
              : fetchedRecipe.ingredients || '',
          });
          setQuery(fetchedRecipe.cuisine || ''); // Set query to the fetched cuisine or an empty string
          setLoading(false);
        })
        .catch(_error => {
          Alert.alert('Error', 'Failed to fetch recipe details');
          setLoading(false);
        });
    }
  }, [recipeId]);

  React.useEffect(() => {
    axios
      .get('https://foodanddrinksapp.onrender.com/api/recipes/cuisines')
      .then(response => {
        setCountries(response.data);
      })
      .catch(_error => {
        Alert.alert('Error', 'Failed to fetch countries');
      });
  }, []);

  const handleSave = () => {
    const missingFields = [];

    // Ensure recipe.cuisine is always set to the query value if not already
    const finalCuisine = query.trim() || recipe.cuisine;

    if (!recipe.name) {
      missingFields.push('Name');
    }
    if (!finalCuisine) {
      missingFields.push('Cuisine');
    }
    if (!recipe.type) {
      missingFields.push('Type');
    }
    if (!recipe.continent) {
      missingFields.push('Continent');
    }

    if (missingFields.length > 0) {
      Alert.alert(
        'Error',
        `Please fill out the following fields: ${missingFields.join(', ')}`,
      );
      return;
    }

    // Update recipe with final values
    const updatedRecipe = {
      ...recipe,
      cuisine: finalCuisine,
      ingredients:
        typeof recipe.ingredients === 'string'
          ? recipe.ingredients.split(',').map(ingredient => ingredient.trim())
          : recipe.ingredients,
      instructions: recipe.instructions || '', // Ensure instructions field is not undefined
    };

    if (!recipeId) {
      delete updatedRecipe._id;
    }

    const apiCall = recipeId
      ? axios.put(
          `https://foodanddrinksapp.onrender.com/api/recipes/${recipeId}`,
          updatedRecipe,
        )
      : axios.post(
          'https://foodanddrinksapp.onrender.com/api/recipes',
          updatedRecipe,
        );

    apiCall
      .then(_response => {
        Alert.alert(
          'Success',
          `Recipe ${recipeId ? 'updated' : 'added'} successfully`,
        );
        navigation.navigate('RecipeList');
      })
      .catch(error => {
        console.error(
          `Failed to ${recipeId ? 'update' : 'add'} recipe:`,
          error.response?.data || error.message,
        );
        Alert.alert('Error', `Failed to ${recipeId ? 'update' : 'add'} recipe`);
      });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={recipe.name}
        onChangeText={text => setRecipe({...recipe, name: text})}
        placeholder="Recipe Name"
        placeholderTextColor="#888"
      />
      <RNPicker
        selectedValue={recipe.continent}
        style={styles.picker}
        onValueChange={itemValue =>
          setRecipe({...recipe, continent: itemValue})
        }>
        {continents.map(continent => (
          <RNPicker.Item key={continent} label={continent} value={continent} />
        ))}
      </RNPicker>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={text => setQuery(text)}
        placeholder="Country (Cuisine)"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        value={recipe.ingredients}
        onChangeText={text => setRecipe({...recipe, ingredients: text})}
        placeholder="Ingredients (Optional)"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        value={recipe.instructions}
        onChangeText={text => setRecipe({...recipe, instructions: text})}
        placeholder="Instructions (Optional)"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        value={recipe.description}
        onChangeText={text => setRecipe({...recipe, description: text})}
        placeholder="Description (Optional)"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        value={recipe.imageUrl}
        onChangeText={text => setRecipe({...recipe, imageUrl: text})}
        placeholder="Image URL (Optional)"
        placeholderTextColor="#888"
      />
      <RNPicker
        selectedValue={recipe.type}
        style={styles.picker}
        onValueChange={itemValue => setRecipe({...recipe, type: itemValue})}>
        {productTypes.map(type => (
          <RNPicker.Item
            key={type}
            label={type.charAt(0).toUpperCase() + type.slice(1)}
            value={type}
          />
        ))}
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
    color: '#000',
  },
});

export default RecipeDetailScreen;

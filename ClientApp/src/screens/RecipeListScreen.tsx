import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
} from 'react-native';
import axios from 'axios';

const RecipeListScreen = ({route, navigation}: any) => {
  const {type, country} = route.params;
  const [recipes, setRecipes] = useState<any[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios
      .get(
        `https://foodanddrinksapp.onrender.com/api/recipes?type=${type}&country=${country}`,
      )
      .then(response => {
        setRecipes(response.data);
        setFilteredRecipes(response.data); // Ініціалізуємо відфільтрований список
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
        Alert.alert('Error', 'Failed to fetch recipes');
      });
  }, [type, country]);

  useEffect(() => {
    // Фільтруємо рецепти на основі запиту пошуку
    setFilteredRecipes(
      recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    );
  }, [searchQuery, recipes]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search recipe..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredRecipes}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <View style={styles.recipeCard}>
            <Image
              source={{uri: item.imageUrl}} // Зображення з URL
              style={styles.recipeImage}
            />
            <View style={styles.textContainer}>
              <Text style={styles.recipeName}>{item.name}</Text>
              <Text style={styles.cuisineName}>{item.cuisine}</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('RecipeDetail', {recipe: item})
                }>
                <Text style={styles.viewDetails}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: '#777',
  },
  recipeCard: {
    flexDirection: 'row', // Розташування зображення та тексту в ряд
    padding: 20,
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    alignItems: 'center', // Центруємо вміст по вертикалі
  },
  recipeImage: {
    width: 100, // Встановлює ширину зображення
    height: 100, // Встановлює висоту зображення
    borderRadius: 8, // Закруглені кути для зображення
    marginRight: 20, // Відстань між зображенням та текстом
  },
  textContainer: {
    flex: 1, // Розтягує текстову частину, щоб заповнити простір
  },
  recipeName: {
    fontWeight: 'bold',
    color: '#777',
  },
  cuisineName: {
    color: '#777',
  },
  viewDetails: {
    color: 'blue',
    marginTop: 10,
  },
});

export default RecipeListScreen;

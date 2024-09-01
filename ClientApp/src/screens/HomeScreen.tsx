import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, ActivityIndicator } from 'react-native';
import axios from 'axios';

interface Recipe {
  _id: string;
  name: string;
  cuisine: string;
  ingredients: string[];
  instructions: string;
  imageUrl: string;
  type: 'food' | 'drink';
}

const HomeScreen = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://foodanddrinksapp.onrender.com/api/recipes')
      .then(response => {
        setRecipes(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Recipes"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredRecipes}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.recipeCard}>
            <Text style={styles.recipeName}>{item.name}</Text>
            <Text>{item.cuisine}</Text>
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
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  recipeCard: {
    padding: 20,
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  recipeName: {
    fontWeight: 'bold',
  },
});

export default HomeScreen;

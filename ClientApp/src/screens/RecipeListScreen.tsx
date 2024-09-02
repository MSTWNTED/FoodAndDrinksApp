import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

const RecipeListScreen = ({ route, navigation }: any) => {
  const { type, country } = route.params;
  const [recipes, setRecipes] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    axios.get(`https://foodanddrinksapp.onrender.com/api/recipes?type=${type}&country=${country}`)
      .then(response => {
        setRecipes(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
        Alert.alert('Error', 'Failed to fetch recipes');
      });
  }, [type, country]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.recipeCard}>
            <Text style={styles.recipeName}>{item.name}</Text>
            <Text style={styles.cuisineName}>{item.cuisine}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}>
              <Text style={styles.viewDetails}>View Details</Text>
            </TouchableOpacity>
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
  recipeCard: {
    padding: 20,
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
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

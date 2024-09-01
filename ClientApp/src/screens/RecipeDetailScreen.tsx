import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Визначення типів для навігатора
type RootStackParamList = {
  RecipeDetail: { recipe: Recipe };
};

type RecipeDetailRouteProp = RouteProp<RootStackParamList, 'RecipeDetail'>;
type RecipeDetailNavigationProp = StackNavigationProp<RootStackParamList, 'RecipeDetail'>;

interface Recipe {
  name: string;
  cuisine: string;
  ingredients: string[];
  instructions: string;
  imageUrl: string;
}

interface RecipeDetailProps {
  route: RecipeDetailRouteProp;
  navigation: RecipeDetailNavigationProp;
}

const RecipeDetailScreen: React.FC<RecipeDetailProps> = ({ route }) => {
  const { recipe } = route.params;
  const [showIngredients, setShowIngredients] = React.useState(false);
  const [showInstructions, setShowInstructions] = React.useState(false);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{recipe.name}</Text>
      <Text style={styles.subtitle}>{recipe.cuisine}</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        <TouchableOpacity onPress={() => setShowIngredients(!showIngredients)}>
          <Text style={styles.toggleButton}>
            {showIngredients ? 'Hide' : 'Show'} Ingredients
          </Text>
        </TouchableOpacity>
        {showIngredients && (
          <View style={styles.content}>
            {recipe.ingredients.map((ingredient, index) => (
              <Text key={index} style={styles.text}>{ingredient}</Text>
            ))}
          </View>
        )}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        <TouchableOpacity onPress={() => setShowInstructions(!showInstructions)}>
          <Text style={styles.toggleButton}>
            {showInstructions ? 'Hide' : 'Show'} Instructions
          </Text>
        </TouchableOpacity>
        {showInstructions && (
          <Text style={styles.text}>{recipe.instructions}</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#777',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    paddingLeft: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  toggleButton: {
    fontSize: 16,
    color: 'blue',
    marginBottom: 10,
  },
});

export default RecipeDetailScreen;

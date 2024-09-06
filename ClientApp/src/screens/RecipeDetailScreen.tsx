import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Recipe} from '../types.ts';

type RootStackParamList = {
  RecipeDetail: {recipe: Recipe};
};

type RecipeDetailRouteProp = RouteProp<RootStackParamList, 'RecipeDetail'>;
type RecipeDetailNavigationProp = StackNavigationProp<
  RootStackParamList,
  'RecipeDetail'
>;

interface RecipeDetailProps {
  route: RecipeDetailRouteProp;
  navigation: RecipeDetailNavigationProp;
}

const RecipeDetailScreen: React.FC<RecipeDetailProps> = ({route}) => {
  const {recipe} = route.params;
  const scrollViewRef = useRef<ScrollView>(null);

  // Рефи для секцій
  const ingredientsRef = useRef<View>(null);
  const instructionsRef = useRef<View>(null);
  const descriptionRef = useRef<View>(null);

  // Стан для розгортання секцій
  const [showIngredients, setShowIngredients] = useState<boolean>(false);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);

  const scrollToSection = (ref: React.RefObject<View>) => {
    ref.current?.measureLayout(
      scrollViewRef.current?.getScrollableNode()!,
      (x, y) => {
        scrollViewRef.current?.scrollTo({x: 0, y: y, animated: true});
      },
      (error: Error) => console.error(error),
    );
  };

  return (
    <ScrollView ref={scrollViewRef} style={styles.container}>
      <Text style={styles.title}>{recipe.name}</Text>
      <Text style={styles.subtitle}>{recipe.cuisine}</Text>

      {/* Додаємо зображення рецепту */}
      <Image
        source={{uri: recipe.imageUrl}}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Зміст */}
      <View style={styles.tableOfContents}>
        <Text style={styles.tableOfContentsTitle}>Table of Contents</Text>
        <TouchableOpacity onPress={() => scrollToSection(descriptionRef)}>
          <Text style={styles.tableOfContentsItem}>Description</Text>
        </TouchableOpacity>
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <TouchableOpacity onPress={() => scrollToSection(ingredientsRef)}>
            <Text style={styles.tableOfContentsItem}>Ingredients</Text>
          </TouchableOpacity>
        )}
        {recipe.instructions && recipe.instructions.trim() !== '' && (
          <TouchableOpacity onPress={() => scrollToSection(instructionsRef)}>
            <Text style={styles.tableOfContentsItem}>Instructions</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Опис рецепту */}
      <View style={styles.section} ref={descriptionRef}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.text}>{recipe.description}</Text>
      </View>

      {/* Секція Ingredients */}
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <View style={styles.section} ref={ingredientsRef}>
          <TouchableOpacity
            onPress={() => setShowIngredients(!showIngredients)}>
            <Text style={styles.sectionTitle}>
              {showIngredients ? 'Hide Ingredients' : 'Ingredients'}
            </Text>
          </TouchableOpacity>
          {showIngredients && (
            <View style={styles.content}>
              {recipe.ingredients.map((ingredient, index) => (
                <Text key={index} style={styles.text}>
                  {ingredient}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Секція Instructions */}
      {recipe.instructions && recipe.instructions.trim() !== '' && (
        <View style={styles.section} ref={instructionsRef}>
          <TouchableOpacity
            onPress={() => setShowInstructions(!showInstructions)}>
            <Text style={styles.sectionTitle}>
              {showInstructions ? 'Hide Instructions' : 'Instructions'}
            </Text>
          </TouchableOpacity>
          {showInstructions && (
            <Text style={styles.text}>{recipe.instructions}</Text>
          )}
        </View>
      )}
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
    color: '#777',
  },
  subtitle: {
    fontSize: 18,
    color: '#777',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  tableOfContents: {
    marginBottom: 20,
  },
  tableOfContentsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#777',
  },
  tableOfContentsItem: {
    fontSize: 16,
    color: 'blue',
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#777',
  },
  content: {
    paddingLeft: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: '#777',
  },
});

export default RecipeDetailScreen;

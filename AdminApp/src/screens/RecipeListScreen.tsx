import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Button, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Перевірте цей імпорт

type RootStackParamList = {
    RecipeList: undefined;
    RecipeDetail: { recipeId: string | null };
};

type RecipeListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RecipeDetail'>;

type Props = {
    navigation: RecipeListScreenNavigationProp;
};

interface Recipe {
    _id: string;
    name: string;
    cuisine: string;
    ingredients: string;
    instructions: string;
    imageUrl: string;
    type: 'food' | 'drink';
}

const RecipeListScreen: React.FC<Props> = ({ navigation }) => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('https://foodanddrinksapp.onrender.com/api/recipes')
            .then(response => {
                setRecipes(response.data);
                setLoading(false);
            })
            .catch(_error => {
                Alert.alert('Error', 'Failed to fetch recipes');
                setLoading(false);
            });
    }, []);

    const handleRecipePress = (recipeId: string) => {
        navigation.navigate('RecipeDetail', { recipeId });
    };

    const handleAddRecipePress = () => {
        navigation.navigate('RecipeDetail', { recipeId: null });
    };

    const handleDelete = (recipeId: string) => {
        Alert.alert(
            'Delete Recipe',
            'Are you sure you want to delete this recipe?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        axios.delete(`https://foodanddrinksapp.onrender.com/api/recipes/${recipeId}`)
                            .then(_response => {
                                setRecipes(recipes.filter(recipe => recipe._id !== recipeId));
                                Alert.alert('Success', 'Recipe deleted successfully');
                            })
                            .catch(_error => {
                                Alert.alert('Error', 'Failed to delete recipe');
                            });
                    }
                }
            ]
        );
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={recipes}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.title}>{item.name}</Text>
                        <Text style={styles.subtitle}>{item.cuisine}</Text>
                        <View style={styles.buttonsContainer}>
                            <Button title="View Details" onPress={() => handleRecipePress(item._id)} />
                            <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteButton}>
                                <Icon name="delete" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
            <Button title="Add New Recipe" onPress={handleAddRecipePress} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        color: '#777',
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deleteButton: {
        marginLeft: 10,
    },
});

export default RecipeListScreen;

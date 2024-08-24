import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';

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
        axios.get('http://localhost:3000/api/recipes')
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
                        <Button title="View Details" onPress={() => handleRecipePress(item._id)} />
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
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        color: '#777',
    },
});

export default RecipeListScreen;

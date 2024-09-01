import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, FlatList, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

const CountrySelectionScreen = ({ route, navigation }: any) => {
  const { type } = route.params;
  const [countries, setCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get unique countries based on the type (food or drink)
    axios.get(`https://foodanddrinksapp.onrender.com/api/recipes/cuisines?type=${type}`)
      .then(response => {
        setCountries(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
        Alert.alert('Error', 'Failed to fetch countries');
      });
  }, [type]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={countries}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Button
            title={item}
            onPress={() => navigation.navigate('RecipeList', { type, country: item })}
          />
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
});

export default CountrySelectionScreen;

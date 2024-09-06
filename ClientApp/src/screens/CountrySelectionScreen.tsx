import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';

const CountrySelectionScreen = ({route, navigation}: any) => {
  const {type, continent} = route.params;
  const [countries, setCountries] = useState<string[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Отримання унікальних країн на основі типу та континенту
    axios
      .get(
        `https://foodanddrinksapp.onrender.com/api/recipes/cuisines/type-continent?type=${type}&continent=${continent}`,
      )
      .then(response => {
        setCountries(response.data);
        setFilteredCountries(response.data); // Ініціалізуємо відфільтрований список
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
        Alert.alert('Error', 'Failed to fetch countries');
      });
  }, [type, continent]);

  useEffect(() => {
    // Фільтруємо країни на основі запиту пошуку
    setFilteredCountries(
      countries.filter(country =>
        country.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    );
  }, [searchQuery, countries]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search country..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredCountries}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.countryCard}
            onPress={() =>
              navigation.navigate('RecipeList', {type, country: item})
            }>
            <Text style={styles.countryText}>{item}</Text>
          </TouchableOpacity>
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
    color: '#333',
  },
  countryCard: {
    padding: 20,
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    alignItems: 'center',
  },
  countryText: {
    fontSize: 18,
    color: '#333',
  },
});

export default CountrySelectionScreen;

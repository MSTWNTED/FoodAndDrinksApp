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

const ContinentSelectionScreen = ({route, navigation}: any) => {
  const {type} = route.params;
  const [continents, setContinents] = useState<string[]>([]);
  const [filteredContinents, setFilteredContinents] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Отримання унікальних континентів на основі типу (їжа або напій)
    axios
      .get(
        `https://foodanddrinksapp.onrender.com/api/recipes/continents/type?type=${type}`,
      )
      .then(response => {
        setContinents(response.data);
        setFilteredContinents(response.data); // Ініціалізуємо відфільтрований список
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
        Alert.alert('Error', 'Failed to fetch continents');
      });
  }, [type]);

  useEffect(() => {
    // Фільтруємо континенти на основі запиту пошуку
    setFilteredContinents(
      continents.filter(continent =>
        continent.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    );
  }, [searchQuery, continents]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search continent..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredContinents}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.continentCard}
            onPress={() =>
              navigation.navigate('CountrySelection', {type, continent: item})
            }>
            <Text style={styles.continentText}>{item}</Text>
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
  continentCard: {
    padding: 20,
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    alignItems: 'center',
  },
  continentText: {
    fontSize: 18,
    color: '#333',
  },
});

export default ContinentSelectionScreen;

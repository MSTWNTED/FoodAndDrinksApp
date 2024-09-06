import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';

const ContinentSelectionScreen = ({route, navigation}: any) => {
  const {type} = route.params; // Отримуємо тип (food або drink)
  const [continents, setContinents] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Отримуємо унікальні континенти з бази даних
    axios
      .get(
        `https://foodanddrinksapp.onrender.com/api/recipes/continents?type=${type}`,
      )
      .then(response => {
        setContinents(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
        Alert.alert('Error', 'Failed to fetch continents');
      });
  }, [type]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={continents}
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

import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';

const HomeScreen = ({navigation}: any) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.leftButton]}
        onPress={() => navigation.navigate('CountrySelection', {type: 'food'})}>
        <Text style={styles.buttonText}>Food</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.rightButton]}
        onPress={() =>
          navigation.navigate('CountrySelection', {type: 'drink'})
        }>
        <Text style={styles.buttonText}>Drink</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row', // Розташовує елементи по горизонталі
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%', // Займає всю висоту
  },
  leftButton: {
    backgroundColor: '#4CAF50', // Колір для кнопки їжі
  },
  rightButton: {
    backgroundColor: '#FF5722', // Колір для кнопки напоїв
  },
  buttonText: {
    color: '#fff', // Білий колір тексту
    fontSize: 24, // Розмір шрифту
    fontWeight: 'bold',
  },
});

export default HomeScreen;

import React from 'react';
import { View, StyleSheet, Button } from 'react-native';

const HomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Button
        title="Food"
        onPress={() => navigation.navigate('CountrySelection', { type: 'food' })}
      />
      <Button
        title="Drink"
        onPress={() => navigation.navigate('CountrySelection', { type: 'drink' })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
});

export default HomeScreen;

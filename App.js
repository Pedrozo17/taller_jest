import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
// IMPORTANTE: Ajusta la ruta dependiendo de en qué carpeta guardaste WalletScreen.js
// Como en tu código anterior importaste '../utils/walletEngine', asumo que WalletScreen 
// está en una carpeta como 'src/screens/' o 'src/components/'.
import WalletScreen from './src/screens/WalletScreen'; 

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <WalletScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
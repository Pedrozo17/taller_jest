import React, {
  useMemo,
  useState,
} from 'react';

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import {
  generateTransactionHistoryWithPoints,
  calculateNetBalance,
} from '../utils/walletEngine';

const allTransactions =
  generateTransactionHistoryWithPoints(200);

export default function WalletScreen() {

  const [filter, setFilter] =
    useState('Todos');

  // Filtrado instantáneo
  const filteredTransactions =
    useMemo(() => {

      if (filter === 'Ingreso') {

        return allTransactions.filter(
          item =>
            item.type === 'Ingreso'
        );

      }

      if (filter === 'Retiro') {

        return allTransactions.filter(
          item =>
            item.type === 'Retiro'
        );

      }

      return allTransactions;

    }, [filter]);

  // Saldo neto
  const netBalance =
    calculateNetBalance(
      filteredTransactions
    );

  // Puntos ADSO acumulados
  const totalAdsoPoints =
    filteredTransactions.reduce(
      (total, item) =>
        total + item.adsoPoints,
      0
    );

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        E-Wallet Bunker
      </Text>

      <Text style={styles.subtitle}>
        Saldo Neto
      </Text>

      <Text style={styles.balance}>
        $
        {netBalance.toLocaleString(
          'es-CO'
        )}
      </Text>

      <Text style={styles.subtitle}>
        Puntos ADSO
      </Text>

      <Text style={[styles.balance, { color: '#f0a500' }]}>
        {totalAdsoPoints.toLocaleString('es-CO', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} pts
      </Text>

      {/* Filtros */}
      <View style={styles.filters}>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            setFilter('Todos')
          }
        >
          <Text>
            Todos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            setFilter('Ingreso')
          }
        >
          <Text>
            Ingresos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            setFilter('Retiro')
          }
        >
          <Text>
            Retiros
          </Text>
        </TouchableOpacity>

      </View>

      {/* Lista */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}

        renderItem={({ item }) => (

          <View style={styles.card}>

            <Text style={styles.account}>
              Cuenta:
              {' '}
              {item.accountNumber}
            </Text>

            <Text>
              Tipo:
              {' '}
              {item.type}
            </Text>

            <Text>
              Estado:
              {' '}
              {item.status}
            </Text>

            <Text style={styles.date}>
              {new Date(
                item.date
              ).toLocaleDateString()}
            </Text>

            <Text
              style={{
                color:
                  item.type ===
                  'Ingreso'
                    ? 'green'
                    : 'red',

                fontWeight: 'bold',
                fontSize: 18,
              }}
            >
              $
              {item.amount.toLocaleString(
                'es-CO'
              )}
            </Text>

            {item.adsoPoints > 0 && (
              <Text style={{ color: '#f0a500', fontWeight: 'bold' }}>
                +{item.adsoPoints.toLocaleString('es-CO', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} pts ADSO
              </Text>
            )}

          </View>

        )}

      />

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 18,
  },

  balance: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 25,
  },

  filters: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },

  card: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
  },

  account: {
    fontWeight: 'bold',
  },

  date: {
    marginTop: 5,
    marginBottom: 5,
    color: '#666',
  },

});
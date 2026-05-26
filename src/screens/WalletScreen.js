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
  TextInput, // <-- Añadido para ingresar la cantidad
  Alert,     // <-- Añadido para mostrar estados de la transacción
} from 'react-native';

import {
  generateTransactionHistoryWithPoints,
  calculateNetBalance,
  purchaseUSDT, // <-- Importamos tu nueva lógica del motor lúdico
} from '../utils/walletEngine';

// Generamos el historial inicial requerido de Faker (mínimo 200)
const allTransactions = generateTransactionHistoryWithPoints(200);

export default function WalletScreen() {
  const [filter, setFilter] = useState('Todos');
  
  // --- ESTADOS PARA MONEDA EXTRANJERA ---
  const [usdtAmount, setUsdtAmount] = useState(''); // Input de texto
  const [cryptoBalance, setCryptoBalance] = useState(0); // Saldo acumulado USDT
  const [copDeductions, setCopDeductions] = useState(0); // Control de lo gastado en Crypto

  // Filtrado instantáneo (Fase 3.3)
  const filteredTransactions = useMemo(() => {
    if (filter === 'Ingreso') {
      return allTransactions.filter(item => item.type === 'Ingreso');
    }
    if (filter === 'Retiro') {
      return allTransactions.filter(item => item.type === 'Retiro');
    }
    return allTransactions;
  }, [filter]);

  // Saldo neto base calculado del motor (Fase 3.1)
  const baseNetBalance = useMemo(() => {
    return calculateNetBalance(allTransactions); 
  }, []);

  // Saldo Neto Real disponible (Restando lo gastado en compras de USDT)
  const actualNetBalance = baseNetBalance - copDeductions;

  // Función para procesar la simulación de compra
  const handleCryptoPurchase = () => {
    const amount = parseFloat(usdtAmount);
    
    // Validación de entrada
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Por favor ingresa una cantidad válida de USDT');
      return;
    }

    // Invocar el motor financiero testeado en Docker
    const tx = purchaseUSDT(actualNetBalance, amount);

    if (tx.status === 'Rechazado') {
      // Reto de Testing 1 superado visualmente: Error si no hay saldo suficiente
      Alert.alert('Transacción Rechazada', `Motivo: ${tx.error}`);
    } else {
      // Reto de Testing 2 superado: Éxito en conversión con tasa fluctuante de Faker
      setCopDeductions(prev => prev + tx.costCOP);
      setCryptoBalance(prev => prev + tx.amountUSDT);
      setUsdtAmount(''); // Limpiar input
      
      Alert.alert(
        '¡Compra Exitosa!', 
        `Compraste: ${tx.amountUSDT} USDT\nTasa de cambio: $${tx.exchangeRate.toLocaleString('es-CO')} COP\nCosto Total: $${tx.costCOP.toLocaleString('es-CO')} COP`
      );
    }
  };

  // Puntos ADSO acumulados (Mantenido de Cashback)
  const totalAdsoPoints = filteredTransactions.reduce(
    (total, item) => total + item.adsoPoints,
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>E-Wallet Bunker</Text>

      {/* PANEL DE SALDOS (Fase 3.1 unificada con módulo de divisas) */}
      <View style={styles.balanceContainer}>
        <View>
          <Text style={styles.subtitle}>Saldo Neto COP</Text>
          <Text style={styles.balance}>
            $ {actualNetBalance.toLocaleString('es-CO')}
          </Text>
        </View>
        <View style={styles.cryptoBadge}>
          <Text style={styles.cryptoBadgeTitle}>Saldo USDT</Text>
          <Text style={styles.cryptoBadgeValue}>{cryptoBalance} 🪙</Text>
        </View>
      </View>

      {/* FORMULARIO: COMPRA DE MONEDA EXTRANJERA (Línea de Negocio - Aprendiz 1) */}
      <View style={styles.cryptoForm}>
        <Text style={styles.formTitle}>🏦 Casa de Cambio Crypto ADSO-Pay</Text>
        <View style={styles.formRow}>
          <TextInput
            style={styles.input}
            placeholder="Ej: 50"
            keyboardType="numeric"
            value={usdtAmount}
            onChangeText={setUsdtAmount}
          />
          <TouchableOpacity style={styles.buyButton} onPress={handleCryptoPurchase}>
            <Text style={styles.buyButtonText}>Comprar USDT</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* PUNTOS ADSO GENERALES (Mantenido de Cashback) */}
      <Text style={styles.subtitlePoints}>Puntos ADSO Totales</Text>
      <Text style={[styles.balancePoints, { color: '#f0a500' }]}>
        {totalAdsoPoints.toLocaleString('es-CO', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} pts
      </Text>

      {/* SECCIÓN HISTORIAL Y FILTROS */}
      <Text style={styles.historyTitle}>Historial de Transacciones</Text>
      
      {/* Filtros rápidos (Fase 3.3) */}
      <View style={styles.filters}>
        <TouchableOpacity
          style={[styles.button, filter === 'Todos' && styles.activeButton]}
          onPress={() => setFilter('Todos')}
        >
          <Text style={filter === 'Todos' && styles.activeButtonText}>Todos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, filter === 'Ingreso' && styles.activeButton]}
          onPress={() => setFilter('Ingreso')}
        >
          <Text style={filter === 'Ingreso' && styles.activeButtonText}>Ingresos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, filter === 'Retiro' && styles.activeButton]}
          onPress={() => setFilter('Retiro')}
        >
          <Text style={filter === 'Retiro' && styles.activeButtonText}>Retiros</Text>
        </TouchableOpacity>
      </View>

      {/* Lista optimizada FlatList (Fase 3.2 unificada con estilos de fila e indicador de puntos) */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.account}>Cuenta: {item.accountNumber}</Text>
              <Text style={styles.statusBadge}>{item.status}</Text>
            </View>

            <View style={styles.cardRow}>
              <Text style={styles.date}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
              
              {/* Pintado condicional: Verde para Ingresos, Rojo para Retiros */}
              <Text
                style={{
                  color: item.type === 'Ingreso' ? '#10b981' : '#ef4444',
                  fontWeight: 'bold',
                  fontSize: 18,
                }}
              >
                {item.type === 'Ingreso' ? '+' : '-'} $ {item.amount.toLocaleString('es-CO')}
              </Text>
            </View>

            {/* INTEGRACIÓN DE INDICA_DOR DE PUNTOS DE CASHBACK EN CADA TARJETA */}
            {item.adsoPoints > 0 && (
              <View style={[styles.cardRow, { marginTop: 5 }]}>
                <Text style={{ color: '#64748b', fontSize: 12 }}>Bono generado:</Text>
                <Text style={{ color: '#f0a500', fontWeight: 'bold', fontSize: 13 }}>
                  +{item.adsoPoints.toLocaleString('es-CO', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })} pts ADSO
                </Text>
              </View>
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
    backgroundColor: '#f8fafc',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 15,
    textAlign: 'center',
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e3a8a',
    padding: 18,
    borderRadius: 14,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 13,
    color: '#93c5fd',
    fontWeight: '600',
  },
  subtitlePoints: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 5,
  },
  balance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 2,
  },
  balancePoints: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 2,
    marginBottom: 15,
  },
  cryptoBadge: {
    backgroundColor: '#1e293b',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cryptoBadgeTitle: {
    color: '#34d399',
    fontSize: 11,
    fontWeight: '700',
  },
  cryptoBadgeValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  cryptoForm: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 10,
  },
  formRow: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
    fontSize: 16,
    color: '#000',
  },
  buyButton: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 10,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#e2e8f0',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: '#3b82f6',
  },
  activeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  account: {
    fontWeight: '600',
    color: '#334155',
  },
  statusBadge: {
    fontSize: 11,
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
    fontWeight: '500',
  },
  date: {
    color: '#94a3b8',
    fontSize: 13,
  },
});
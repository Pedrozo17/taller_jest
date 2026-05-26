import { faker } from '@faker-js/faker';

const transactionTypes = [
  'Ingreso',
  'Retiro',
];

const transactionStatus = [
  'Completado',
  'Pendiente',
  'Rechazado',
];

// Crear una transacción
const createTransaction = () => {
  return {
    id: faker.string.uuid(),
    accountNumber: faker.finance.accountNumber(),
    type: faker.helpers.arrayElement(transactionTypes),
    amount: faker.number.float({
      min: 10000,
      max: 500000,
      fractionDigits: 2,
    }),
    date: faker.date.recent({
      days: 30,
    }),
    status: faker.helpers.arrayElement(transactionStatus),
  };
};

// --- EXPORTS MODERNOS CON LA PALABRA CLAVE "export" ---

// Generar historial
export const generateTransactionHistory = (count = 1) => {
  return faker.helpers.multiple(createTransaction, { count });
};

// Regla de negocio
export const calculateNetBalance = (transactions) => {
  return transactions.reduce((total, transaction) => {
    if (transaction.status !== 'Completado') {
      return total;
    }

    if (transaction.type === 'Ingreso') {
      return total + transaction.amount;
    }

    if (transaction.type === 'Retiro') {
      return total - transaction.amount;
    }

    return total;
  }, 0);
};

/**
 *
 * @param {number} currentBalanceCOP 
 * @param {number} amountToBuyUSDT 
 */
export function purchaseUSDT(currentBalanceCOP, amountToBuyUSDT) {
  // Generar tasa de cambio fluctuante entre $3.900 y $4.300 COP usando Faker
  const exchangeRate = faker.number.int({ min: 3900, max: 4300 });
  
  // Calcular el costo total de la transacción en pesos
  const costCOP = amountToBuyUSDT * exchangeRate;
  
  // Reto de Testing 1: Validar saldo suficiente
  if (costCOP > currentBalanceCOP) {
    return {
      status: 'Rechazado',
      error: 'Saldo insuficiente en COP',
      exchangeRate,
      costCOP: 0,
      remainingCOP: currentBalanceCOP
    };
  }
  
  // Reto de Testing 2: Conversión exitosa
  return {
    status: 'Completado',
    exchangeRate,
    costCOP,
    amountUSDT: amountToBuyUSDT,
    remainingCOP: currentBalanceCOP - costCOP
  };
}
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
    date: faker.date.recent({ days: 30 }),
    date: faker.date.recent({
      days: 30,
    }),
    status: faker.helpers.arrayElement(transactionStatus),
  };
};

// --- EXPORTS MODERNOS CON LA PALABRA CLAVE "export" ---

// Generar historial
const generateTransactionHistory = (count = 1) => {
  return faker.helpers.multiple(createTransaction, { count });
};

// Regla de negocio
const calculateNetBalance = (transactions) => {
export const generateTransactionHistory = (count = 1) => {
  return faker.helpers.multiple(createTransaction, { count });
};

//Historial con puntos ADSO
const generateTransactionHistoryWithPoints = (
  count = 1
) => {

  const transactions =
    generateTransactionHistory(count);

  return transactions.map(
    transaction => ({
      ...transaction,
      adsoPoints:
        transaction.status === 'Completado' &&
        transaction.type === 'Retiro' &&
        transaction.amount > 50.000
          ? transaction.amount * 0.01
          : 0,
    })
  );

};


const calculateNetBalance = (
  transactions
) => {

  return transactions.reduce(
    (total, transaction) => {

      if (
        transaction.status !==
        'Completado'
      ) {
        return total;
      }

      if (
        transaction.type ===
        'Ingreso'
      ) {

        return (
          total +
          transaction.amount
        );

      }

      if (
        transaction.type ===
        'Retiro'
      ) {

        return (
          total -
          transaction.amount
        );

      }

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

    if (transaction.type === 'Ingreso') {
      return total + transaction.amount;
    }

    if (transaction.type === 'Retiro') {
      return total - transaction.amount;
    }

    return total;
  }, 0);
};

//Puntos ADSO 
const calculateAdsoPoints = (
  transactions
) => {

  return transactions.reduce(
    (totalPoints, transaction) => {

      if (
        transaction.status !==
        'Completado'
      ) {
        return totalPoints;
      }

      if (
        transaction.type !==
        'Retiro'
      ) {
        return totalPoints;
      }

      if (
        transaction.amount <= 50.000
      ) {
        return totalPoints;
      }

      return (
        totalPoints +
        transaction.amount * 0.01
      );

// NUEVO: Módulo de Moneda Extranjera (compra de USDT)
const comprarUSDT = (saldoCOP, montoCOP) => {
  const tasaCambio = faker.number.float({ min: 3900, max: 4300, fractionDigits: 2 });

  if (montoCOP > saldoCOP) {
    return { estado: 'Rechazado', mensaje: 'Saldo insuficiente' };
  }

  const usdt = montoCOP / tasaCambio;
  return { estado: 'Completado', usdt, tasaCambio };
};

export {
  generateTransactionHistory,
  generateTransactionHistoryWithPoints,
  calculateNetBalance,
  comprarUSDT, // <-- se añade aquí sin tocar lo anterior
};
  calculateAdsoPoints,
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

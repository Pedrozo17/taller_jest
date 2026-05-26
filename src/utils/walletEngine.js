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
    status: faker.helpers.arrayElement(transactionStatus),
  };
};

// Generar historial
const generateTransactionHistory = (count = 1) => {
  return faker.helpers.multiple(createTransaction, { count });
};

// Regla de negocio
const calculateNetBalance = (transactions) => {
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

// NUEVO: Módulo de Moneda Extranjera (compra de USDT)
const comprarUSDT = (saldoCOP, montoCOP) => {
  const tasaCambio = faker.number.float({ min: 3900, max: 4300, fractionDigits: 2 });

  if (montoCOP > saldoCOP) {
    return { estado: 'Rechazado', mensaje: 'Saldo insuficiente' };
  }

  const usdt = montoCOP / tasaCambio;
  return { estado: 'Completado', usdt, tasaCambio };
};

module.exports = {
  generateTransactionHistory,
  calculateNetBalance,
  comprarUSDT, // <-- se añade aquí sin tocar lo anterior
};

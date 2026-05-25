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

    accountNumber:
      faker.finance.accountNumber(),

    type:
      faker.helpers.arrayElement(
        transactionTypes
      ),

    amount:
      faker.number.float({
        min: 10000,
        max: 500000,
        fractionDigits: 2,
      }),

    date:
      faker.date.recent({
        days: 30,
      }),

    status:
      faker.helpers.arrayElement(
        transactionStatus
      ),

  };

};

// Generar historial
const generateTransactionHistory = (
  count = 1
) => {

  return faker.helpers.multiple(
    createTransaction,
    { count }
  );

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

      return total;

    },
    0
  );

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

    },
    0
  );

};

export {
  generateTransactionHistory,
  generateTransactionHistoryWithPoints,
  calculateNetBalance,
  calculateAdsoPoints,
};
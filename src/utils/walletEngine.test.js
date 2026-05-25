import {
  generateTransactionHistory,
  calculateNetBalance,
  calculateAdsoPoints,
} from './walletEngine';

describe(
  'Wallet Engine Tests',
  () => {

    test(
      'Debe generar exactamente la cantidad solicitada',
      () => {

        const result =
          generateTransactionHistory(50);

        expect(result)
          .toHaveLength(50);

      }
    );

    test(
      'El amount siempre debe ser positivo',
      () => {

        const result =
          generateTransactionHistory(20);

        result.forEach(
          transaction => {

            expect(
              transaction.amount
            ).toBeGreaterThan(0);

          }
        );

      }
    );

    test(
      'No deben existir campos undefined',
      () => {

        const [transaction] =
          generateTransactionHistory(1);

        Object.values(
          transaction
        ).forEach(value => {

          expect(value)
            .not.toBeUndefined();

        });

      }
    );

    test(
      'Debe calcular correctamente el saldo neto',
      () => {

        const mockTransactions = [ //mockTransactions sirve para tener el control total de lo que tu estas probando.
          {
            type: 'Ingreso',
            amount: 100000,
            status: 'Completado',
          },
          {
            type: 'Retiro',
            amount: 30000,
            status: 'Completado',
          },
        ];

        const result =
          calculateNetBalance(
            mockTransactions
          );

        expect(result)
          .toBe(70000);

      }
    );

    test(
      'Transacciones menores a $50.000 COP deben sumar exactamente 0 puntos ADSO',
      () => {

        const mockTransactions = [
          {
            type: 'Retiro',
            amount: 49999.99,
            status: 'Completado',
          },
          {
            type: 'Retiro',
            amount: 10000,
            status: 'Completado',
          },
          {
            type: 'Retiro',
            amount: 50000,
            status: 'Completado',
          },
        ];

        const result =
          calculateAdsoPoints(
            mockTransactions
          );

        expect(result).toBe(0);

      }
    );

    test(
      'Transacciones Rechazadas o Pendientes no acumulan puntos ADSO bajo ninguna circunstancia',
      () => {

        const mockTransactions = [
          {
            type: 'Retiro',
            amount: 200000,
            status: 'Rechazado',
          },
          {
            type: 'Retiro',
            amount: 300000,
            status: 'Pendiente',
          },
          {
            type: 'Ingreso',
            amount: 500000,
            status: 'Completado',
          },
        ];

        const result =
          calculateAdsoPoints(
            mockTransactions
          );

        expect(result).toBe(0);

      }
    );

  }
);
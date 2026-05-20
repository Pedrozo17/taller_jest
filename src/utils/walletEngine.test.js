import {
  generateTransactionHistory,
  calculateNetBalance,
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

        const mockTransactions = [
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

  }
);
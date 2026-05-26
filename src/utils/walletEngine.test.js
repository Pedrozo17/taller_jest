import {
  generateTransactionHistory,
  calculateNetBalance,
  purchaseUSDT
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

describe('Módulo de Moneda Extranjera (Crypto / Divisas) - Aprendiz 1', () => {
  
  test('Debe retornar un error o estado Rechazado si el usuario no tiene saldo suficiente', () => {
    const currentBalanceCOP = 50000; // Saldo bajo
    const amountToBuyUSDT = 20;       // Requiere más de $78.000 COP
    
    const result = purchaseUSDT(currentBalanceCOP, amountToBuyUSDT);
    
    expect(result.status).toBe('Rechazado');
    expect(result.error).toBe('Saldo insuficiente en COP');
  });

  test('La conversión matemática de COP a USDT debe coincidir exactamente con la tasa de Faker', () => {
    const currentBalanceCOP = 500000; // Saldo de sobra
    const amountToBuyUSDT = 50;
    
    const result = purchaseUSDT(currentBalanceCOP, amountToBuyUSDT);
    
    expect(result.status).toBe('Completado');
    // Verificamos que el costo en COP sea exactamente (Tasa simulada * Cantidad USDT)
    expect(result.costCOP).toBe(result.exchangeRate * amountToBuyUSDT);
    // Verificamos que se reste correctamente del saldo
    expect(result.remainingCOP).toBe(currentBalanceCOP - result.costCOP);
  });
});
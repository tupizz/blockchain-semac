import { TransactionDTO } from '../dtos/types';

class Mempool {
  private transactions: Map<string, TransactionDTO>;

  constructor() {
    this.transactions = new Map<string, TransactionDTO>();
  }

  // Add a transaction to the mempool
  addTransaction(transaction: TransactionDTO): void {
    this.transactions.set(transaction.id, transaction);
  }

  // Fetch all transactions
  getAllTransactions(): TransactionDTO[] {
    return Array.from(this.transactions.values());
  }

  // Clear mempool
  clearMempool(): void {
    this.transactions.clear();
  }
}

export { Mempool };

export type PayloadDTO = {
  amount: number;
  from: string;
  to: string;
};

export type TransactionDTO = {
  id: string;
  payload: PayloadDTO; // You can refine this to represent your transaction structure
};

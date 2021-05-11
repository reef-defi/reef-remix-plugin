import { Contract } from "ethers";
import { TRANSACTION_ADD_CONTRACT, TRANSACTION_REMOVE_ALL_CONTRACT, TRANSACTION_REMOVE_CONTRACT } from "../actionType";

interface TransactionAddContract {
  type: typeof TRANSACTION_ADD_CONTRACT;
  contract: Contract;
}

interface TransactionDeleteContract {
  type: typeof TRANSACTION_REMOVE_CONTRACT;
  index: number;
}

interface TransactionDeleteAllContracts {
  type: typeof TRANSACTION_REMOVE_ALL_CONTRACT
}

export type TransactionActionType =
  | TransactionAddContract
  | TransactionDeleteContract
  | TransactionDeleteAllContracts;

export const transactionAddContract = (contract: Contract): TransactionAddContract => ({
  type: TRANSACTION_ADD_CONTRACT,
  contract,
});

export const transactionDeleteContract = (index: number): TransactionDeleteContract => ({
  type: TRANSACTION_REMOVE_CONTRACT,
  index,
});

export const transactionDeleteAllContract = (): TransactionDeleteAllContracts => ({
  type: TRANSACTION_REMOVE_ALL_CONTRACT,
});
import { Contract } from "ethers";
import { CONTRACTS_ADD, CONTRACTS_REMOVE_ALL, CONTRACTS_REMOVE } from "../actionType";

interface TransactionAddContract {
  type: typeof CONTRACTS_ADD;
  contract: Contract;
}

interface TransactionDeleteContract {
  type: typeof CONTRACTS_REMOVE;
  index: number;
}

interface TransactionDeleteAllContracts {
  type: typeof CONTRACTS_REMOVE_ALL
}

export type TransactionActionType =
  | TransactionAddContract
  | TransactionDeleteContract
  | TransactionDeleteAllContracts;

export const transactionAddContract = (contract: Contract): TransactionAddContract => ({
  type: CONTRACTS_ADD,
  contract,
});

export const transactionDeleteContract = (index: number): TransactionDeleteContract => ({
  type: CONTRACTS_REMOVE,
  index,
});

export const transactionDeleteAllContract = (): TransactionDeleteAllContracts => ({
  type: CONTRACTS_REMOVE_ALL,
});
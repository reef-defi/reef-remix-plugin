import { Contract } from "ethers";
import { CONTRACTS_ADD, CONTRACTS_REMOVE_ALL, CONTRACTS_REMOVE } from "../actionType";

interface ContractAdd {
  type: typeof CONTRACTS_ADD;
  contract: Contract;
}

interface ContractRemove {
  type: typeof CONTRACTS_REMOVE;
  index: number;
}

interface ContractRemoveAll {
  type: typeof CONTRACTS_REMOVE_ALL
}

export type ContractActionType =
  | ContractAdd
  | ContractRemove
  | ContractRemoveAll;

export const contractAdd = (contract: Contract): ContractAdd => ({
  type: CONTRACTS_ADD,
  contract,
});

export const contractRemove = (index: number): ContractRemove => ({
  type: CONTRACTS_REMOVE,
  index,
});

export const contractRemoveAll = (): ContractRemoveAll => ({
  type: CONTRACTS_REMOVE_ALL,
});
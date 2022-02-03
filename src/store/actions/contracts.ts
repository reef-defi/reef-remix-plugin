import { Contract } from "ethers";
import { ContractHolder } from "../localState";
import { CONTRACTS_ADD, CONTRACTS_REMOVE_ALL, CONTRACTS_REMOVE, CONTRACTS_ADD_MULTIPLE } from "../actionType";


interface ContractAdd {
  type: typeof CONTRACTS_ADD;
  contract: ContractHolder;
}

interface ContractAddMultiple {
  type: typeof CONTRACTS_ADD_MULTIPLE;
  contracts: ContractHolder[];
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
  | ContractRemoveAll
  | ContractAddMultiple;

export const contractAdd = (name: string, contract: Contract): ContractAdd => ({
  type: CONTRACTS_ADD,
  contract: {name, contract}
});

export const contractRemove = (index: number): ContractRemove => ({
  type: CONTRACTS_REMOVE,
  index,
});

export const contractRemoveAll = (): ContractRemoveAll => ({
  type: CONTRACTS_REMOVE_ALL,
});

export const contractAddMultiple = (contracts: ContractHolder[]): ContractAddMultiple => ({
  contracts,
  type: CONTRACTS_ADD_MULTIPLE,
});
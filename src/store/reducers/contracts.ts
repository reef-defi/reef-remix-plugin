import { ContractHolder } from "../localState";
import { ContractActionType } from "../actions/contracts";
import { CONTRACTS_ADD, CONTRACTS_REMOVE_ALL, CONTRACTS_REMOVE } from "../actionType";

export interface ContractsReducer {
  contracts: ContractHolder[];
}

const initialState: ContractsReducer = {
  contracts: [],
};

export const contractsReducer = (state=initialState, action: ContractActionType): ContractsReducer => {
  switch (action.type) {
    case CONTRACTS_ADD: return {...state, contracts: [...state.contracts, action.contract]};
    case CONTRACTS_REMOVE: return {...state, contracts: [
      ...state.contracts.slice(0, action.index),
      ...state.contracts.slice(action.index+1)
    ]};
    case CONTRACTS_REMOVE_ALL: return {...state, contracts: []};
    default: return state;
  }
}
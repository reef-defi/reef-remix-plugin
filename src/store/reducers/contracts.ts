import { Contract } from "ethers";
import { ContractActionType } from "../actions/contracts";
import { CONTRACTS_ADD, CONTRACTS_REMOVE_ALL, CONTRACTS_REMOVE } from "../actionType";

export interface ContractReducer {
  contracts: Contract[];
}

const initialState: ContractReducer = {
  contracts: [],
};

export const contractsReducer = (state=initialState, action: ContractActionType): ContractReducer => {
  switch (action.type) {
    case CONTRACTS_ADD: return {...state, contracts: [...state.contracts, action.contract]};
    case CONTRACTS_REMOVE: return {...state, contracts: [...state.contracts.splice(action.index, 1)]};
    case CONTRACTS_REMOVE_ALL: return {...state, contracts: []};
    default: return state;
  }
}
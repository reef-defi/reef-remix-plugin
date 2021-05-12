import { Contract } from "ethers";
import { TransactionActionType } from "../actions/contracts";
import { CONTRACTS_ADD, CONTRACTS_REMOVE_ALL, CONTRACTS_REMOVE } from "../actionType";

export interface TransactionReducer {
  contracts: Contract[];
}

const initialState: TransactionReducer = {
  contracts: [],
};

export const transactionReducer = (state=initialState, action: TransactionActionType): TransactionReducer => {
  switch (action.type) {
    case CONTRACTS_ADD: return {...state, contracts: [...state.contracts, action.contract]};
    case CONTRACTS_REMOVE: return {...state, contracts: [...state.contracts.splice(action.index, 1)]};
    case CONTRACTS_REMOVE_ALL: return {...state, contracts: []};
    default: return state;
  }
}
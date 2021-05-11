import { Contract } from "ethers";
import { TransactionActionType } from "../actions/transaction";
import { TRANSACTION_ADD_CONTRACT, TRANSACTION_REMOVE_ALL_CONTRACT, TRANSACTION_REMOVE_CONTRACT } from "../actionType";

export interface TransactionReducer {
  contracts: Contract[];
}

const initialState: TransactionReducer = {
  contracts: [],
};

export const transactionReducer = (state=initialState, action: TransactionActionType): TransactionReducer => {
  switch (action.type) {
    case TRANSACTION_ADD_CONTRACT: return {...state, contracts: [...state.contracts, action.contract]};
    case TRANSACTION_REMOVE_CONTRACT: return {...state, contracts: [...state.contracts.splice(action.index, 1)]};
    case TRANSACTION_REMOVE_ALL_CONTRACT: return {...state, contracts: []};
    default: return state;
  }
}
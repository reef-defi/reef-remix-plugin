import { combineReducers} from 'redux';
import { ContractReducer, contractReducer } from './contracts';
import { SignersReducer, signersReducer } from './signers';
import { TransactionReducer, transactionReducer } from './transaction';


const rootReducer = combineReducers({
  contracts: contractReducer,
  transactions: transactionReducer,
  signers: signersReducer,
});

export interface StateType {
  contracts: ContractReducer,
  transactions: TransactionReducer,
  signers: SignersReducer,
}

export default rootReducer;
export type RootReducerType = ReturnType<typeof rootReducer>;
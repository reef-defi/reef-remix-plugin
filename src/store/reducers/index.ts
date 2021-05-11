import { combineReducers} from 'redux';
import { ContractReducer, contractReducer } from './contracts';
import { TransactionReducer, transactionReducer } from './transaction';


const rootReducer = combineReducers({
  contracts: contractReducer,
  transactions: transactionReducer,
});

export interface StateType {
  contracts: ContractReducer,
  transactions: TransactionReducer,
}

export default rootReducer;
export type RootReducerType = ReturnType<typeof rootReducer>;
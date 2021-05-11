import { combineReducers} from 'redux';
import { ContractReducer, contractReducer } from './contracts';


const rootReducer = combineReducers({
  contracts: contractReducer
});

export interface StateType {
  contracts: ContractReducer
}

export default rootReducer;
export type RootReducerType = ReturnType<typeof rootReducer>;
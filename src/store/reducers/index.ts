import { combineReducers} from 'redux';
import { CompiledContractReducer, compiledContractReducer } from './compiledContracts';
import { SignersReducer, signersReducer } from './signers';
import { ContractsReducer, contractsReducer } from './contracts';


const rootReducer = combineReducers({
  compiledContracts: compiledContractReducer,
  contracts: contractsReducer,
  signers: signersReducer,
});

export interface StateType {
  compiledContracts: CompiledContractReducer,
  contracts: ContractsReducer,
  signers: SignersReducer,
}

export default rootReducer;
export type RootReducerType = ReturnType<typeof rootReducer>;
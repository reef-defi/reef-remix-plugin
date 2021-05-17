import { combineReducers} from 'redux';
import { CompiledContractReducer, compiledContractReducer } from './compiledContracts';
import { SignersReducer, signersReducer } from './signers';
import { ContractsReducer, contractsReducer } from './contracts';
import { UtilsReducer, utilsReducer } from './utils';


const rootReducer = combineReducers({
  utils: utilsReducer,
  signers: signersReducer,
  contracts: contractsReducer,
  compiledContracts: compiledContractReducer,
});

export interface StateType {
  utils: UtilsReducer,
  signers: SignersReducer,
  contracts: ContractsReducer,
  compiledContracts: CompiledContractReducer,
}

export default rootReducer;
export type RootReducerType = ReturnType<typeof rootReducer>;
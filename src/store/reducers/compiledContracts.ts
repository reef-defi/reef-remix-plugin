import { ContractType } from "../actions/compiledContracts";
import { COMPILED_CONTRACT_DEPLOYED, COMPILED_CONTRACT_DEPLOYING, COMPILED_CONTRACT_ERROR, COMPILED_CONTRACT_LOAD } from "../actionType";
import { CompilationResult, CompiledContract } from "@remixproject/plugin-api/lib/compiler/type";

interface Contract {
  filename: string;
  contractName: string;
  payload: CompiledContract;
}

interface Contracts {
  [name: string]: Contract;
}

export interface ContractReducer {
  deploying: boolean;
  contracts: Contracts;
  errorMessage: string;
}

const initialState: ContractReducer = {
  deploying: false,
  contracts: {},
  errorMessage: "",
};

export const contractReducer = (state=initialState, action: ContractType): ContractReducer => {
  switch (action.type) {
    case COMPILED_CONTRACT_LOAD:
      return {...state, contracts: normalizeCompilationOutput(action.data)};
    case COMPILED_CONTRACT_DEPLOYING:
      return {...state, deploying: true, errorMessage: ""};
    case COMPILED_CONTRACT_DEPLOYED:
      return {...state, deploying: false}
    case COMPILED_CONTRACT_ERROR:
      return {...state, errorMessage: action.message};
    default: 
      return state;
  }
};

const normalizeCompilationOutput = (data: CompilationResult | null): Contracts => {
  if (data == null) {
    return {};
  }

  const contracts: Contracts = {};

  Object.entries(data.contracts).forEach(([filename, fileContents]) => {
    Object.entries(fileContents).forEach(([contractName, contractData]) => {
      contracts[`${contractName} - ${filename}`] = {
        payload: {...contractData},
        filename,
        contractName
      }
    })
  });

  return contracts;
}
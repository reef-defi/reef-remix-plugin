import { ContractType } from "../actions/contracts";
import { CONTRACT_DEPLOYED, CONTRACT_DEPLOYING, CONTRACT_LOAD } from "../actionType";
import { CompilationResult, CompiledContract } from "@remixproject/plugin-api/lib/compiler/type";

interface Contract {
  payload: CompiledContract;
  filename: string;
  contractName: string;
}

interface Contracts {
  [name: string]: Contract;
}

export interface ContractReducer {
  deploying: boolean;
  contracts: Contracts;
}

const initialState: ContractReducer = {
  deploying: false,
  contracts: {}
};

export const contractReducer = (state=initialState, action: ContractType): ContractReducer => {
  switch (action.type) {
    case CONTRACT_LOAD:
      return {...state, contracts: normalizeCompilationOutput(action.data)};
    case CONTRACT_DEPLOYING:
      return {...state, deploying: true};
    case CONTRACT_DEPLOYED:
      return {...state, deploying: false}
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
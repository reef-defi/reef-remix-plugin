import { ContractType } from "../actions/contracts";
import { CONTRACT_LOAD } from "../actionType";
import { CompilationResult, CompiledContract } from "@remixproject/plugin-api/lib/compiler/type";

interface Contracts {
    [name: string]: {
      payload: CompiledContract;
      filename: string;
      contractName: string;
    }
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
      return {deploying: false, contracts: normalizeCompilationOutput(action.data)};
    default:
      return state;
  }
};

const normalizeCompilationOutput = (data: CompilationResult): Contracts => {
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
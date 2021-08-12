import { CompiledContractType, ContractLoad } from "../actions/compiledContracts";
import { COMPILED_CONTRACT_DEPLOYED, COMPILED_CONTRACT_DEPLOYING, COMPILED_CONTRACT_ERROR, COMPILED_CONTRACT_LOAD } from "../actionType";

import { ReefContract } from "../../api";



interface Contracts {
  [name: string]: ReefContract;
}

export interface CompiledContractReducer {
  deploying: boolean;
  contracts: Contracts;
  errorMessage: string;
}

const initialState: CompiledContractReducer = {
  deploying: false,
  contracts: {},
  errorMessage: "",
};

export const compiledContractReducer = (state=initialState, action: CompiledContractType): CompiledContractReducer => {
  switch (action.type) {
    case COMPILED_CONTRACT_LOAD:
      return {...state, contracts: normalizeCompilationOutput(action)};
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

const normalizeCompilationOutput = ({data, optimization, runs, compilerVersion, compilationSources, target}: ContractLoad): Contracts => {
  if (data == null) {
    return {};
  }

  const contracts: Contracts = {};

  Object.entries(data.contracts).forEach(([filename, fileContents]) => {
    Object.entries(fileContents).forEach(([contractName, contractData]) => {
      contracts[`${contractName} - ${filename}`] = {
        runs,
        target,
        filename,
        contractName,
        optimization,
        compilerVersion,
        payload: {...contractData},
        license: data.sources[filename].ast.license,
        source: compilationSources.sources[filename].content
      }
    })
  });

  return contracts;
}
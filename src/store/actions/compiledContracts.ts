import { COMPILED_CONTRACT_DEPLOYED, COMPILED_CONTRACT_DEPLOYING, COMPILED_CONTRACT_ERROR, COMPILED_CONTRACT_LOAD } from "../actionType";

import { CompilationResult } from "@remixproject/plugin-api/lib/compiler/type";

interface ContractLoad {
  type: typeof COMPILED_CONTRACT_LOAD;
  data: CompilationResult | null;
}

interface ContractDeploying {
  type: typeof COMPILED_CONTRACT_DEPLOYING;
}

interface ContractDeployed {
  type: typeof COMPILED_CONTRACT_DEPLOYED;
}

interface ContractError {
  type: typeof COMPILED_CONTRACT_ERROR,
  message: string;
}

export type CompiledContractType = 
  | ContractLoad
  | ContractError
  | ContractDeployed
  | ContractDeploying;

export const compiledContractLoad = (data: CompilationResult | null): ContractLoad => ({
  data,
  type: COMPILED_CONTRACT_LOAD,
});

export const compiledContractDeployed = (): ContractDeployed => ({
  type: COMPILED_CONTRACT_DEPLOYED
});

export const compiledContractDeploying = (): ContractDeploying => ({
  type: COMPILED_CONTRACT_DEPLOYING
});

export const compiledContractError = (message: string): ContractError => ({
  type: COMPILED_CONTRACT_ERROR,
  message
});
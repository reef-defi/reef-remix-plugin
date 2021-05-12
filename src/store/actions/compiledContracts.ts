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

export type ContractType = 
  | ContractLoad
  | ContractError
  | ContractDeployed
  | ContractDeploying;

export const contractLoad = (data: CompilationResult | null): ContractLoad => ({
  data,
  type: COMPILED_CONTRACT_LOAD,
});

export const contractDeployed = (): ContractDeployed => ({
  type: COMPILED_CONTRACT_DEPLOYED
});

export const contractDeploying = (): ContractDeploying => ({
  type: COMPILED_CONTRACT_DEPLOYING
});

export const contractError = (message: string): ContractError => ({
  type: COMPILED_CONTRACT_ERROR,
  message
});
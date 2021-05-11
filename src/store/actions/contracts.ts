import { CONTRACT_DEPLOYED, CONTRACT_DEPLOYING, CONTRACT_ERROR, CONTRACT_LOAD } from "../actionType";

import { CompilationResult } from "@remixproject/plugin-api/lib/compiler/type";

interface ContractLoad {
  type: typeof CONTRACT_LOAD;
  data: CompilationResult | null;
}

interface ContractDeploying {
  type: typeof CONTRACT_DEPLOYING;
}

interface ContractDeployed {
  type: typeof CONTRACT_DEPLOYED;
}

interface ContractError {
  type: typeof CONTRACT_ERROR,
  message: string;
}

export type ContractType = 
  | ContractLoad
  | ContractError
  | ContractDeployed
  | ContractDeploying;

export const contractLoad = (data: CompilationResult | null): ContractLoad => ({
  data,
  type: CONTRACT_LOAD,
});

export const contractDeployed = (): ContractDeployed => ({
  type: CONTRACT_DEPLOYED
});

export const contractDeploying = (): ContractDeploying => ({
  type: CONTRACT_DEPLOYING
});

export const contractError = (message: string): ContractError => ({
  type: CONTRACT_ERROR,
  message
});
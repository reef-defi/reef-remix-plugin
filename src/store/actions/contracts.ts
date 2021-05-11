import { CONTRACT_DEPLOYED, CONTRACT_DEPLOYING, CONTRACT_LOAD } from "../actionType";

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

export type ContractType = 
  | ContractLoad
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
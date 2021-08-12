import { COMPILED_CONTRACT_DEPLOYED, COMPILED_CONTRACT_DEPLOYING, COMPILED_CONTRACT_ERROR, COMPILED_CONTRACT_LOAD } from "../actionType";

import { CompilationResult, CompilationFileSources } from "@remixproject/plugin-api/lib/compiler/type";

export interface ContractSourceContent {
  sources: {
    [key: string]: {
      content: string;
    }
  }
}

export interface ContractLoad {
  type: typeof COMPILED_CONTRACT_LOAD;
  runs: number;
  target: string;
  optimization: boolean;
  compilerVersion: string;
  data: CompilationResult | null;
  compilationSources: ContractSourceContent;
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

export const compiledContractLoad = (data: CompilationResult | null, optimization: boolean, runs: number, compilerVersion: string, compilationSources: ContractSourceContent, target: string): ContractLoad => ({
  data,
  runs,
  target,
  optimization,
  compilerVersion,
  compilationSources,
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
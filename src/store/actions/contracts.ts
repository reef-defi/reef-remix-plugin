import { CONTRACT_INIT, CONTRACT_LOAD } from "../actionType";

import { CompilationResult } from "@remixproject/plugin-api/lib/compiler/type";

interface ContractLoad {
  type: typeof CONTRACT_LOAD
  data: any
}

export type ContractType = 
  | ContractLoad

export const contractLoad = (data: CompilationResult | null): ContractLoad => ({
  data,
  type: CONTRACT_LOAD,
});
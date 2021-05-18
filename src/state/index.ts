import { Contract } from "ethers";
import { FunctionDescription } from "@remixproject/plugin-api/lib/compiler/type";

export interface ContractHolder {
  name: string;
  contract: Contract;
}

export interface ContractAttributeState {
  text: string;
  error: boolean;
  abi: FunctionDescription;
}

export const contractAttributeDefaultState = (abi: FunctionDescription): ContractAttributeState => ({
  abi,
  text: "",
  error: false,
});
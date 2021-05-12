import { Contract } from "ethers";
import { ABIDescription } from "@remixproject/plugin-api/lib/compiler/type";

export interface ContractHolder {
  name: string;
  contract: Contract;
}

export interface ContractAttributeState {
  text: string;
  error: boolean;
  loading: boolean;
  abi: ABIDescription;
}

export const contractAttributeDefaultState = (abi: ABIDescription): ContractAttributeState => ({
  abi,
  text: "",
  error: false,
  loading: false,
});
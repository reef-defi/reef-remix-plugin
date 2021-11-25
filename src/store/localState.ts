import { Contract, BigNumber } from "ethers";
import { Signer } from "@reef-defi/evm-provider";
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


export interface RemixSigner {
  balance: BigNumber;
  address: string;
  evmAddress: string;
  isEvmClaimed: boolean;
  name: string;
  signer: Signer;
}

export interface ContractAttribute {
  name: string;
  type: string;
  value: string;
}
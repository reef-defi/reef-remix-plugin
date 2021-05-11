import Web3 from "web3";
import { CompiledContract, ABIDescription, ABIParameter } from "@remixproject/plugin-api/lib/compiler/type";

export const fromAscii = (value: any): any => {
  return Array.isArray(value)
    ? value.map((v) => fromAscii(v))
    : Web3.utils.fromAscii(value)
}

export const getConstructor = (abi: ABIDescription[]): ABIDescription | undefined => 
  abi.find((a) => a.type === "constructor");

export const contractParameters = (parameters: string): any[] => 
  parameters
    .split(",")
    .map((param) => param.trim());

export const prepareContractParams = (userParams: string, contractParams: ABIParameter[]): any[] => {
  const params = contractParameters(userParams);
  return contractParams
      .map(({type}, index) => type.startsWith('bytes') 
      ? fromAscii(params[index])
      : params[index]
    );
}
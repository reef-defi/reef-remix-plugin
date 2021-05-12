import Web3 from "web3";
import { CompiledContract, ABIDescription, ABIParameter } from "@remixproject/plugin-api/lib/compiler/type";
import { ethers } from "ethers";

export const fromAscii = (value: any): any => {
  return Array.isArray(value)
    ? value.map((v) => fromAscii(v))
    : Web3.utils.asciiToHex(value);
}

export const getConstructor = (abi: ABIDescription[]): ABIDescription | undefined => 
  abi.find((a) => a.type === "constructor");

export const contractParameters = (parameters: string): string[] => {
  if (parameters === "") {
    return [];
  }
  return parameters
    .split(",")
    .map((param) => param.trim());
}

export const getParameters = (abi?: ABIDescription): ABIParameter[] => 
  abi ? abi.inputs ? abi.inputs as ABIParameter[] : [] : [];

export const prepareContractParams = (userParams: string, contractParams: ABIParameter[]): any[] => {
  const params = contractParameters(userParams);
  console.log("Contract params: ", contractParams);
  console.log("User params: ", userParams);
  console.log("Contract params: ", fromAscii(userParams[0]));
  const r = contractParams
    .map(({type}, index) => type.startsWith('bytes') 
    ? fromAscii(params[index])
    : params[index]
  );
  console.log(r)
  return r;
}
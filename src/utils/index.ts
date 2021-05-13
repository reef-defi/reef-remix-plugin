import Web3 from "web3";
import { CompiledContract, ABIDescription, ABIParameter } from "@remixproject/plugin-api/lib/compiler/type";
import { ethers } from "ethers";


export const getConstructor = (abi: ABIDescription[]): ABIDescription | undefined => 
  abi.find((a) => a.type === "constructor");

export const prepareParameters = (parameters: string): any[] => {
  if (parameters === "") {
    return [];
  }
  const params = ("[" + parameters + "]")
    .replaceAll("\"", "")
    .replaceAll(/([A-Za-z0-9]+)/g, "\"$1\"");

  return JSON.parse(params);
}

export const getParameters = (abi?: ABIDescription): ABIParameter[] => 
  abi ? abi.inputs ? abi.inputs as ABIParameter[] : [] : [];

// export const prepareContractParams = (userParams: string, contractParams: ABIParameter[]): any[] => {
//   const params = contractParameters(userParams);
//   console.log("Contract params: ", contractParams);
//   console.log("User params: ", userParams);
//   console.log("Contract params: ", fromAscii(userParams[0]));
//   const r = contractParams
//     .map(({type}, index) => type.startsWith('bytes') 
//     ? fromAscii(params[index])
//     : params[index]
//   );
//   console.log(r)
//   return r;
// }
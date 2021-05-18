import { ABIDescription, ABIParameter } from "@remixproject/plugin-api/lib/compiler/type";
import { RemixSigner } from "../state/signers";

export const getConstructor = (abi: ABIDescription[]): ABIDescription | undefined => 
  abi.find((a) => a.type === "constructor");

export const prepareParameters = (parameters: string): any[] => {
  if (parameters === "") {
    return [];
  }
  const params = ("[" + parameters + "]")
    .replaceAll("\"", "")
    .replaceAll("\'", "")
    .replaceAll(/([A-Za-z0-9]+)/g, "\"$1\"");

  return JSON.parse(params);
}

export const getParameters = (abi?: ABIDescription): ABIParameter[] => 
  abi ? abi.inputs ? abi.inputs as ABIParameter[] : [] : [];

export const findSigner = (signers: RemixSigner[], address: string): number => {
  for (let index = 0; index < signers.length; index ++) {
    if (signers[index].address === address) {
      return index;
    }
  }
  throw new Error("Signer not found")!
}
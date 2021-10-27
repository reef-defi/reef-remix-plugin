import { ABIDescription, ABIParameter } from "@remixproject/plugin-api/lib/compiler/type";
import { RemixSigner } from "../store/localState";

export const getConstructor = (abi: ABIDescription[]): ABIDescription | undefined => 
  abi.find((a) => a.type === "constructor");

export const prepareParameters = (parameters: string): string[] => 
  parameters === "" 
    ? [] 
    : parameters
      .split(",")
      .map((param) => param.trim());

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

export const delay = async (milliseconds: number): Promise<void> => 
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
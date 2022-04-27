import { ABIDescription, ABIParameter } from "@remixproject/plugin-api/lib/compiler/type";
import { RemixSigner } from "../store/localState";

export const getConstructor = (abi: ABIDescription[]): ABIDescription | undefined => 
  abi.find((a) => a.type === "constructor");

const numbersToString = (arr: any[]): any[] => arr
.map((val) => {
  if (Array.isArray(val)) {
    return numbersToString(val);
  } else if (typeof val === 'number') {
    return val.toLocaleString('fullwide', {useGrouping:false});
  }

  return val;
})

export const prepareParameters = (parameters: string): string[] => {
  if (parameters === "") { return []; }
  const params = parameters.replaceAll(/0x[0-9a-fA-f]{40}/g, (match) => `"${match}"`);
  const result: any[] = JSON.parse(`[${params}]`);
  return numbersToString(result);;
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

export const delay = async (milliseconds: number): Promise<void> => 
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
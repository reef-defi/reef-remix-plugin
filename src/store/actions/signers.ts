import { BigNumber } from "ethers";
import { SIGNERS_BALANCE, SIGNERS_ADD, SIGNERS_SELECT, SIGNERS_CLEAR, SIGNERS_ADD_LIST } from "../actionType";
import { RemixSigner } from "../localState";

interface SignersAdd {
  type: typeof SIGNERS_ADD;
  signer: RemixSigner;
}

interface SignersAddList {
  type: typeof SIGNERS_ADD_LIST;
  signers: RemixSigner[];
}

interface SignersBalance {
  type: typeof SIGNERS_BALANCE;
  balance: BigNumber;
}

interface SignersSelect {
  type: typeof SIGNERS_SELECT;
  index: number
}

interface SignersClear {
  type: typeof SIGNERS_CLEAR;
}

export type SignersActionType =
  | SignersAdd
  | SignersAddList
  | SignersSelect
  | SignersClear
  | SignersBalance;

export const signersClear = (): SignersClear => ({
  type: SIGNERS_CLEAR
});

export const signersAdd = (signer: RemixSigner): SignersAdd => ({
  type: SIGNERS_ADD,
  signer
});
export const signersAddList = (signers: RemixSigner[]): SignersAddList => ({
  type: SIGNERS_ADD_LIST,
  signers
}) 

export const signersBalance = (balance: BigNumber): SignersBalance => ({
  type: SIGNERS_BALANCE,
  balance,
});

export const signersSelect = (index: number): SignersSelect => ({
  type: SIGNERS_SELECT,
  index
});
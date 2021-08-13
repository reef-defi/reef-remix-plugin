import { BigNumber } from "ethers";
import { SIGNERS_BALANCE, SIGNERS_ADD, SIGNERS_SELECT } from "../actionType";
import { RemixSigner } from "../localState";

interface SignersAdd {
  type: typeof SIGNERS_ADD;
  signer: RemixSigner;
}

interface SignersBalance {
  type: typeof SIGNERS_BALANCE;
  balance: BigNumber;
}

interface SignersSelect {
  type: typeof SIGNERS_SELECT;
  index: number
}

export type SignersActionType =
  | SignersAdd
  | SignersSelect
  | SignersBalance;

export const signersAdd = (signer: RemixSigner): SignersAdd => ({
  type: SIGNERS_ADD,
  signer
});

export const signersBalance = (balance: BigNumber): SignersBalance => ({
  type: SIGNERS_BALANCE,
  balance,
});

export const signersSelect = (index: number): SignersSelect => ({
  type: SIGNERS_SELECT,
  index
});
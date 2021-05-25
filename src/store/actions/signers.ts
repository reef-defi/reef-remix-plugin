import { BigNumber } from "ethers";
import { SIGNERS_BALANCE, SIGNERS_LOAD, SIGNERS_SELECT } from "../actionType";
import { RemixSigner } from "../localState";

interface SignersLoad {
  type: typeof SIGNERS_LOAD;
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

export type SignersActionType =
  | SignersLoad
  | SignersSelect
  | SignersBalance;

export const signersLoad = (signers: RemixSigner[]): SignersLoad => ({
  type: SIGNERS_LOAD,
  signers
});

export const signersBalance = (balance: BigNumber): SignersBalance => ({
  type: SIGNERS_BALANCE,
  balance,
});

export const signersSelect = (index: number): SignersSelect => ({
  type: SIGNERS_SELECT,
  index
});
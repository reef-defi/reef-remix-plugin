import { BigNumber } from "ethers";
import { RemixSigner } from "../../state/signers";
import { SIGNERS_BALANCE, SIGNERS_LOAD } from "../actionType";

interface SignersLoad {
  type: typeof SIGNERS_LOAD;
  signers: RemixSigner[];
}

interface SignersBalance {
  type: typeof SIGNERS_BALANCE;
  index: number;
  balance: BigNumber;
}

export type SignersActionType =
  | SignersLoad
  | SignersBalance;

export const signersLoad = (signers: RemixSigner[]): SignersLoad => ({
  type: SIGNERS_LOAD,
  signers
});

export const signersBalance = (index: number, balance: BigNumber): SignersBalance => ({
  type: SIGNERS_BALANCE,
  balance,
  index
});
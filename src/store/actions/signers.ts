import { RemixSigner } from "../../state/signers";
import { SIGNERS_LOAD } from "../actionType";

interface SignersLoad {
  type: typeof SIGNERS_LOAD;
  signers: RemixSigner[];
}

export type SignersActionType =
  | SignersLoad;

export const signersLoad = (signers: RemixSigner[]): SignersLoad => ({
  type: SIGNERS_LOAD,
  signers
});
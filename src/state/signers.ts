import { BigNumber } from "ethers";
import { Signer } from "@reef-defi/evm-provider";

export interface RemixSigner {
  balance: BigNumber;
  address: string;
  signer: Signer;
}
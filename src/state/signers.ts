import { ReefSigner } from "@reef-defi/hardhat-reef/dist/src/proxies/signers/ReefSigner";
import { BigNumber } from "ethers";

export interface RemixSigner {
  balance: BigNumber;
  address: string;
  signer: ReefSigner;
}
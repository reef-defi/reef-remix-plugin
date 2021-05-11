import { ReefSigner } from "@reef-defi/hardhat-reef/dist/src/proxies/signers/ReefSigner";

export interface RemixSigner {
  address: string;
  signer: ReefSigner;
}
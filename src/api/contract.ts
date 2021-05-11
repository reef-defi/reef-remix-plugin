import { ReefSigner } from "@reef-defi/hardhat-reef/dist/src/proxies/signers/ReefSigner";
import { Contract, ContractFactory, Signer } from "ethers";


export const deploy = async (contractAbi: any, params: any[], signer: ReefSigner): Promise<Contract> => {
  return await ContractFactory
    .fromSolidity(contractAbi)
    .connect(signer as Signer)
    .deploy(...params);
}
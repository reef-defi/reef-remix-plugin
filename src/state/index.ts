import { Contract } from "ethers";

export interface ContractHolder {
  name: string;
  contract: Contract;
}

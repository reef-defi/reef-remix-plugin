import { Dispatch } from "redux";
import { Contract, ContractFactory, Signer } from "ethers";
import { CompiledContract } from "@remixproject/plugin-api/lib/compiler/type";
import { contractAdd } from "../store/actions/contracts";
import { RemixSigner } from "../state/signers";
import { compiledContractDeploying, compiledContractDeployed, compiledContractError } from "../store/actions/compiledContracts";

export const deploy = async (contractAbi: CompiledContract, params: any[], signer: Signer): Promise<Contract> => {
  return await ContractFactory
    .fromSolidity(contractAbi)
    .connect(signer as Signer)
    .deploy(...params); // TODO setup the gas & storage limits: {gasLimit: 40, value: 40, storageLimit: 30}
}

export const retrieveContract = (contractAbi: CompiledContract, address: string, signer: Signer): Contract => {
  return new Contract(address, contractAbi.abi, signer as Signer);
}

export const submitDeploy = async (contractName: string, params: any[], contract: CompiledContract, signer: Signer, dispatch: Dispatch<any>) => {
  dispatch(compiledContractDeploying());
  try {
    const newContract = await deploy(contract, params, signer);
    dispatch(contractAdd(contractName, newContract));
    dispatch(compiledContractDeployed());
  } catch (e) {
    console.error(e);
    dispatch(compiledContractError(typeof e === "string" ? e : e.message));
    dispatch(compiledContractDeployed());
  }
}

export const getSigner = (signers: RemixSigner[], address: string): RemixSigner => {
  return signers.find((wallet) => wallet.address === address)!
};
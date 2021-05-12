import { ReefSigner } from "@reef-defi/hardhat-reef/dist/src/proxies/signers/ReefSigner";
import { Contract, ContractFactory, Signer } from "ethers";
import { CompiledContract } from "@remixproject/plugin-api/lib/compiler/type";
import { useDispatch, useSelector } from "react-redux";
import { contractDeploying, contractDeployed, contractError } from "../store/actions/compiledContracts";
import { transactionAddContract } from "../store/actions/contracts";
import { RemixSigner } from "../state/signers";
import { StateType } from "../store/reducers";
import { Dispatch } from "redux";


export const deploy = async (contractAbi: CompiledContract, params: any[], signer: ReefSigner): Promise<Contract> => {
  return await ContractFactory
    .fromSolidity(contractAbi)
    .connect(signer as Signer)
    .deploy(...params);
}

export const retrieveContract = (contractAbi: CompiledContract, address: string, signer: ReefSigner): Contract => {
  return new Contract(address, contractAbi.abi, signer as Signer);
}

export const submitDeploy = async (params: any[], contract: CompiledContract, signer: ReefSigner, dispatch: Dispatch<any>) => {
  dispatch(contractDeploying());
  try {
    const newContract = await deploy(contract, params, signer);
    dispatch(transactionAddContract(newContract));
    dispatch(contractDeployed());
  } catch (e) {
    console.error(e);
    dispatch(contractError(e.message));
    dispatch(contractDeployed());
  }
}

export const getSigner = (signers: RemixSigner[], address: string): RemixSigner => {
  return signers.find((wallet) => wallet.address === address)!
} 
import { Dispatch } from "redux";
import { Contract, ContractFactory, Signer } from "ethers";
import { CompiledContract } from "@remixproject/plugin-api/lib/compiler/type";
import { contractAdd } from "../store/actions/contracts";
import { compiledContractDeploying, compiledContractDeployed, compiledContractError } from "../store/actions/compiledContracts";
import { RemixSigner } from "../store/localState";

interface BaseContract {
  runs: number;
  source: string;
  license: string;
  optimization: boolean;
  compilerVersion: string;
}

export interface VerificationContractReq extends BaseContract {
  address: string;
}

export interface ReefContract extends BaseContract {
  filename: string;
  contractName: string;
  payload: CompiledContract;
}

export const fetchPost = async <Body extends {}, >(url: string, body: Body) => 
  await fetch(url, {
    method: "POST",
    headers: {
      'content-type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify(body)
  });

export const verifyContract = async (address: string, contract: ReefContract, url?: string) => {
  if (!url) { return; }
  await fetchPost<VerificationContractReq>(url, {address, ...contract});
}

export const deploy = async (contractAbi: CompiledContract, params: any[], signer: Signer): Promise<Contract> => {
  return await ContractFactory
    .fromSolidity(contractAbi)
    .connect(signer as Signer)
    .deploy(...params);
}

export const retrieveContract = (contractAbi: CompiledContract, address: string, signer: Signer): Contract => {
  return new Contract(address, contractAbi.abi, signer as Signer);
}

interface DeployParams {
  params: any[],
  signer: Signer,
  contractName: string,
  verificationUrl?: string;
  contract: ReefContract,
  dispatch: Dispatch<any>
}

export const submitDeploy = async ({params, signer, contractName, verificationUrl, contract, dispatch}: DeployParams) => {
  try {
    dispatch(compiledContractDeploying());
    const newContract = await deploy(contract.payload, params, signer);
    verifyContract(newContract.address, contract, verificationUrl);
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
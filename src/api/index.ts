import { Dispatch } from "redux";
import { Contract, ContractFactory, Signer } from "ethers";
import { CompiledContract } from "@remixproject/plugin-api/lib/compiler/type";
import { contractAdd } from "../store/actions/contracts";
import { compiledContractDeploying, compiledContractDeployed, compiledContractError } from "../store/actions/compiledContracts";
import { RemixSigner } from "../store/localState";
import { NotifyFun } from "../store/actions/utils";
import axios from "axios";
import { AxiosResponse } from "axios";

const CONTRACT_VERIFICATION_URL = "/api/verificator/deployed-bytecode-request";

interface BaseContract {
  runs: string;
  source: string;
  target: string;
  license: string;
  optimization: string;
  compilerVersion: string;
}

export interface VerificationContractReq extends BaseContract {
  abi: string;
  name: string;
  address: string;
  bytecode: string;
  arguments: string;
}

interface VerificationRes {
  status: boolean;
  message: string;
}

export interface ReefContract extends BaseContract {
  filename: string;
  contractName: string;
  payload: CompiledContract;
}

export const verifyContract = async (deployedContract: Contract, contract: ReefContract, arg: string[], url?: string): Promise<boolean> => {
  if (!url) { return false; }
  const body: VerificationContractReq = {
    address: deployedContract.address,
    abi: JSON.stringify(contract.payload.abi),
    arguments: JSON.stringify(arg),
    bytecode: deployedContract.deployTransaction.data,
    name: contract.contractName,
    target: contract.target,
    source: contract.source,
    optimization: contract.optimization,
    compilerVersion: contract.compilerVersion,
    license: contract.license,
    runs: contract.runs
  };
  return await axios.post<VerificationContractReq, AxiosResponse<VerificationRes>>
    (`${url}${CONTRACT_VERIFICATION_URL}`, body)
    .then((res) => res.data.status);
}

export const deploy = async (contractAbi: CompiledContract, params: any[], signer: Signer): Promise<Contract> => {
  return ContractFactory
    .fromSolidity(contractAbi)
    .connect(signer as Signer)
    .deploy(...params);
}

export const retrieveContract = (contractAbi: CompiledContract, address: string, signer: Signer): Contract => {
  return new Contract(address, contractAbi.abi, signer as Signer);
}

interface DeployParams {
  params: string[],
  signer: Signer,
  contractName: string,
  reefscanUrl?: string;
  contract: ReefContract,
  notify: NotifyFun,
  dispatch: Dispatch<any>
}

const createDeployedNotification = (name: string, address: string, verificationResult: boolean, url?: string): string => (
  `Contract ${name} deployed successfully on address: ${address}` + (
    url
    ? `
    <br>Check the status of the contract at <a href=${url}/contract/${address} target="_blank">Reefscan URL</a>
    <br>Contract ${name} was${verificationResult ? "" : " not"} verified!`
    : ""
  )
)

export const submitDeploy = async ({params, signer, contractName, reefscanUrl, contract, dispatch, notify}: DeployParams) => {
  try {
    dispatch(compiledContractDeploying());
    console.log("Parameters: ", params);
    notify(`Deploying ${contractName} contract...`);

    const newContract = await deploy(contract.payload, params, signer);
    const verificationResult = await verifyContract(newContract, contract,  params, reefscanUrl);
    notify(createDeployedNotification(
      contract.contractName,
      newContract.address,
      verificationResult,
      reefscanUrl
    ));
    dispatch(contractAdd(contractName, newContract));
    dispatch(compiledContractDeployed());
  } catch (e) {
    console.error(e);
    notify(`Something went wrong... Error: ${e.message}`, "error");
    dispatch(compiledContractError(typeof e === "string" ? e : e.message));
    dispatch(compiledContractDeployed());
  }
}

export const getSigner = (signers: RemixSigner[], address: string): RemixSigner => {
  return signers.find((wallet) => wallet.address === address)!
};
import { Dispatch } from "redux";
import { Signer } from "@reef-defi/evm-provider";
import { Contract, ContractFactory, Signer as EthersSigner } from "ethers";
import { CompiledContract } from "@remixproject/plugin-api/lib/compiler/type";
import { contractAdd } from "../store/actions/contracts";
import { compiledContractDeploying, compiledContractDeployed, compiledContractError } from "../store/actions/compiledContracts";
import { RemixSigner } from "../store/localState";
import { NotifyFun } from "../store/actions/utils";
import axios from "axios";
import { AxiosResponse } from "axios";
import { delay } from "../utils";

const CONTRACT_VERIFICATION_URL = "/api/verificator/automatic-contract-verification";

interface BaseContract {
  runs: string;
  source: string;
  target: string;
  license: string;
  optimization: string;
  compilerVersion: string;
}

export interface VerificationContractReq extends BaseContract {
  name: string;
  address: string;
  filename: string;
  arguments: string;
}


export interface ReefContract extends BaseContract {
  filename: string;
  contractName: string;
  payload: CompiledContract;
}

const contractVerificatorApi = axios.create({
  headers: {
    "Access-Control-Allow-Origin": "*"
  }
})

export const verifyContract = async (deployedContract: Contract, contract: ReefContract, arg: string[], url?: string): Promise<boolean> => {
  if (!url) { return false; }
  try {
    const body: VerificationContractReq = {
      address: deployedContract.address,
      arguments: JSON.stringify(arg),
      name: contract.contractName,
      filename: contract.filename,
      target: contract.target,
      source: contract.source,
      optimization: contract.optimization,
      compilerVersion: contract.compilerVersion,
      license: contract.license,
      runs: contract.runs
    };
    return await contractVerificatorApi.post<VerificationContractReq, AxiosResponse<string>>
      (`${url}${CONTRACT_VERIFICATION_URL}`, body)
      .then((res) => res.data === "VERIFIED")
  } catch (err) {
    return false
  }
}

export const deploy = async (contractAbi: CompiledContract, params: any[], signer: Signer): Promise<Contract> => {
  return ContractFactory
    .fromSolidity(contractAbi)
    .connect(signer as EthersSigner)
    .deploy(...params);
}

export const retrieveContract = (contractAbi: CompiledContract, address: string, signer: Signer): Contract => {
  return new Contract(address, contractAbi.abi, signer as EthersSigner);
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

const deployedNotification = (name: string, address: string, url?: string): string =>
  `Contract ${name} deployed successfully at address: ${address}` + (url && `
    <br>Check the status of the contract at <a href=${url}/contract/${address} target="_blank">Reefscan URL</a>`)

const verificationNofitication = (name: string, result: boolean): string => 
  `<br>Contract ${name} was${result ? "" : " not"} verified!`;

export const submitDeploy = async ({params, signer, contractName, reefscanUrl, contract, dispatch, notify}: DeployParams) => {
  try {
    dispatch(compiledContractDeploying());
    notify(`Deploying ${contractName} contract...`);

    const newContract = await deploy(contract.payload, params, signer);
    notify(deployedNotification(
      contract.contractName,
      newContract.address,
      reefscanUrl
    ));
    delay(1000);
    console.log(newContract.deployTransaction.data);
    const verificationResult = await verifyContract(newContract, contract,  params, reefscanUrl);
    notify(verificationNofitication(contract.contractName, verificationResult));
    dispatch(contractAdd(contractName, newContract));
    dispatch(compiledContractDeployed());
  } catch (e: any) {
    console.error(e);
    notify(`Something went wrong... Error: ${e.message}`, "error");
    dispatch(compiledContractError(typeof e === "string" ? e : e.message));
    dispatch(compiledContractDeployed());
  }
}

export const getSigner = (signers: RemixSigner[], address: string): RemixSigner => {
  return signers.find((wallet) => wallet.address === address)!
};
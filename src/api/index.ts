import { Dispatch } from "redux";
import { Signer } from "@reef-defi/evm-provider";
import { Contract, ContractFactory } from "ethers";
import { CompiledContract } from "@remixproject/plugin-api/lib/compiler/type";
import { contractAdd } from "../store/actions/contracts";
import { compiledContractDeploying, compiledContractDeployed, compiledContractError } from "../store/actions/compiledContracts";
import { RemixSigner } from "../store/localState";
import { NotifyFun } from "../store/actions/utils";
import axios from "axios";
import { AxiosResponse } from "axios";
import { delay } from "../utils";

const CONTRACT_VERIFICATION_URL = "/api/verificator/submit-verification";
// const verification_test = "http://localhost:3000/api/verificator/submit-verification";

interface BaseContract {
  runs: number;
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

const contractVerificatorApi = axios.create();

const doesContractExist = async (url: string, address: string): Promise<boolean> => 
  axios.get(`${url}/api/contract/${address}`)
    .then((_) => true)
    .catch((_) => false);

// Complete await cicle is in pattern: 1+2+3+...+steps.
// Execution time = steps*(steps+1) / 2 s; 
// I.E. Steps = 10; Execution time = 55s
const waitUntilContractExists = async (url: string, address: string, steps=10): Promise<void> => {
  let delayLength = 1000;
  for (let i = 0; i < steps; i ++) {
    await delay(delayLength);
    const res = await doesContractExist(url, address);
    if (res) { return; }
    delayLength += 1000;
  }
  throw new Error("Contract was not detected");
}

export const verifyContract = async (deployedContract: Contract, contract: ReefContract, arg: string[], notify: NotifyFun, url?: string): Promise<void> => {
  if (!url) { return; }
  try {
    const body: VerificationContractReq = {
      address: deployedContract.address,
      arguments: JSON.stringify(arg),
      name: contract.contractName,
      filename: contract.filename,
      target: contract.target,
      source: contract.source,
      optimization: `${contract.optimization}`,
      compilerVersion: contract.compilerVersion,
      license: contract.license,
      runs: contract.runs
    };

    await waitUntilContractExists(url, deployedContract.address);
    await contractVerificatorApi.post<VerificationContractReq, AxiosResponse>
      (`${url}${CONTRACT_VERIFICATION_URL}`, body)
    notify(verificationNofitication(contract.contractName, true));
  } catch (err) {
    console.error(err)
    notify(verificationNofitication(contract.contractName, false));
  }
}

export const deploy = async (compiledContract: CompiledContract, params: any[], signer: Signer): Promise<Contract> => {
  return ContractFactory
    .fromSolidity(compiledContract)
    .connect(signer)
    .deploy(...params);
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
  `Contract ${name} deployed successfully at address: ${address}` + (url ? `
    <br>Check the status of the contract at <a href=${url}/contract/${address} target="_blank">Reefscan URL</a>` : '')

const verificationNofitication = (name: string, result: boolean): string => 
  `<br>Contract ${name} was${result ? "" : " not"} verified!`;

export const submitDeploy = async ({params, signer, contractName, reefscanUrl, contract, dispatch, notify}: DeployParams) => {
  try {
    dispatch(compiledContractDeploying());
    notify(`Deploying ${contractName} contract...`);
    const deployParams = params.map((param) => (param === "true" || param === "false" ? param === "true" : param));
    const newContract = await deploy(contract.payload, deployParams, signer);
    notify(deployedNotification(
      contract.contractName,
      newContract.address,
      reefscanUrl
    ));

    verifyContract(newContract, contract,  params, notify, reefscanUrl);
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
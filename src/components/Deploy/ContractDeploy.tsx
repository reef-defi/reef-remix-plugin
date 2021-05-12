import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSigner, submitDeploy } from "../../api/contract";
import { StateType } from "../../store/reducers";
import { getConstructor, prepareContractParams } from "../../utils";
import { ABIParameter } from "@remixproject/plugin-api/lib/compiler/type";

import Function from "../common/Function";

interface ContractDeployProps {
  contractName: string;
  signerAddress: string;
}

const ContractDeploy = ({contractName, signerAddress}: ContractDeployProps) => {
  const dispatch = useDispatch();

  const {signers} = useSelector((state: StateType) => state.signers);
  const {contracts} = useSelector((state: StateType) => state.compiledContracts);
  const {errorMessage} = useSelector((state: StateType) => state.compiledContracts);

  const signer = getSigner(signers, signerAddress)
  const contract = contracts[contractName].payload;
  const constructorAbi = getConstructor(contract.abi);
  const parameters = constructorAbi!.inputs! as ABIParameter[];

  const submit = async () => 
    await submitDeploy(contractName, [], contract, signer.signer, dispatch);
  const submitCollapse = async (values: string[]) => 
    await submitDeploy(contractName, values, contract, signer.signer, dispatch);
  const submitInline = async (value: string) => {
    const params = prepareContractParams(value, parameters);
    await submitDeploy(contractName, params, contract, signer.signer, dispatch);
  };

  if (!constructorAbi) {
    return (
      <div>
        <a className="btn btn-outline-light btn-text" onClick={submit}>Deploy</a>
      </div>
    );
  } else {
    return <Function
      name="Deploy"
      error={true}
      text={errorMessage}
      parameters={parameters}
      submitInline={submitInline}
      submitCollapse={submitCollapse}
    />
  }
}

export default ContractDeploy;
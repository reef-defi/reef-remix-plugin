import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSigner, submitDeploy } from "../../api/contract";
import { StateType } from "../../store/reducers";
import { getConstructor, getParameters, prepareParameters } from "../../utils";

import Function from "../Function/Function";

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
  const parameters = getParameters(constructorAbi);

  const submitCollapse = async (values: string[]) => 
    await submitDeploy(contractName, values, contract, signer.signer, dispatch);
  const submitInline = async (value: string) => {
    const params = prepareParameters(value);
    await submitDeploy(contractName, params, contract, signer.signer, dispatch);
  };

  return (
    <Function
      name="Deploy"
      error={true}
      text={errorMessage}
      parameters={constructorAbi ? parameters : []}
      submitInline={submitInline}
      submitCollapse={submitCollapse}
    />
  );
}

export default ContractDeploy;
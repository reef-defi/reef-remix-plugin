import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitDeploy } from "../../api";
import { compiledContractError } from "../../store/actions/compiledContracts";
import { signersBalance } from "../../store/actions/signers";
import { StateType } from "../../store/reducers";
import { getConstructor, getParameters, prepareParameters } from "../../utils";

import Function from "../Function/Function";

interface ContractDeployProps {
  contractName: string;
}

const ContractDeploy = ({contractName}: ContractDeployProps) => {
  const dispatch = useDispatch();

  const {provider} = useSelector((state: StateType) => state.utils);
  const {contracts, errorMessage} = useSelector((state: StateType) => state.compiledContracts);
  const {signers, index} = useSelector((state: StateType) => state.signers);

  const signer = signers[index];
  const contract = contracts[contractName].payload;
  const constructorAbi = getConstructor(contract.abi);
  const parameters = getParameters(constructorAbi);

  const submitCollapse = async (values: string[]) => {
    try {
      const params = await prepareParameters(values.join(", "))
      await submitDeploy(contractName, params, contract, signer.signer, dispatch);
      dispatch(signersBalance(await provider!.getBalance(signer.address)));
    } catch (e) {
      dispatch(compiledContractError(e.message));
    }
  };
  const submitInline = async (value: string) => {
    try {
      const params = await prepareParameters(value);
      await submitDeploy(contractName, params, contract, signer.signer, dispatch);
      dispatch(signersBalance(await provider!.getBalance(signer.address)));
    } catch (e) {
      dispatch(compiledContractError(e.message));
    }
  };

  return (
    <Function
      name="Deploy"
      error={true}
      isReturn={true}
      text={errorMessage}
      parameters={constructorAbi ? parameters : []}
      submitInline={submitInline}
      submitCollapse={submitCollapse}
    />
  );
}

export default ContractDeploy;
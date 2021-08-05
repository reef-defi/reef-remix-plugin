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

  const {provider, verificationUrl, notify} = useSelector((state: StateType) => state.utils);
  const {contracts, errorMessage} = useSelector((state: StateType) => state.compiledContracts);
  const {signers, index} = useSelector((state: StateType) => state.signers);

  const signer = signers[index];
  const contract = contracts[contractName];
  const constructorAbi = getConstructor(contract.payload.abi);
  const parameters = getParameters(constructorAbi);

  const partialDeployContent = {
    contract,
    dispatch,
    contractName,
    verificationUrl,
    signer: signer.signer,
  };
  const submitCollapse = async (values: string[]) => {
    try {
      const params = prepareParameters(values.join(", "))
      await submitDeploy({...partialDeployContent, params});
      dispatch(signersBalance(await provider!.getBalance(signer.address)));
      notify(`Contract ${contractName} has been deployed!`);
    } catch (e) {
      dispatch(compiledContractError(e.message));
      notify(e.message, "error");
    }
  };
  const submitInline = async (value: string) => {
    try {
      const params = prepareParameters(value);
      await submitDeploy({...partialDeployContent, params});
      dispatch(signersBalance(await provider!.getBalance(signer.address)));
      notify(`Contract ${contractName} has been deployed!`);
    } catch (e) {
      dispatch(compiledContractError(e.message));
      notify(e.message, "error");
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
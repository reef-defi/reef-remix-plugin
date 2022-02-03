import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReefContract, submitDeploy } from "../../api";
import { compiledContractError } from "../../store/actions/compiledContracts";
import { signersBalance } from "../../store/actions/signers";
import { StateType } from "../../store/reducers";
import { getConstructor, getParameters, prepareParameters } from "../../utils";

import Function from "../Function/Function";

interface ContractDeployProps {
  contractName: string;
}

interface Contracts {
  [name: string]: ReefContract;
}

const combineSources = (contracts: Contracts): string => {
  const sources = Object.keys(contracts).reduce(
    (prev, key) => ({
      ...prev,
      [contracts[key].filename]: contracts[key].source,
    }),
    {}
  );
  return JSON.stringify(sources);
};

const ContractDeploy = ({ contractName }: ContractDeployProps) => {
  const dispatch = useDispatch();

  const { provider, reefscanUrl, notify } = useSelector(
    (state: StateType) => state.utils
  );
  const { contracts, errorMessage } = useSelector(
    (state: StateType) => state.compiledContracts
  );
  const { signers, index } = useSelector((state: StateType) => state.signers);

  const signer = signers[index];
  const contract = contracts[contractName];
  const constructorAbi = getConstructor(contract.payload.abi);
  const parameters = getParameters(constructorAbi);

  const source = combineSources(contracts);

  const partialDeployContent = {
    reefscanUrl,
    contractName,
    signer: signer.signer,
    contract: { ...contract, source },
    notify,
    dispatch,
  };

  const submitCollapse = async (values: string[]) => {
    try {
      const params = prepareParameters(values.join(", "));
      await submitDeploy({ ...partialDeployContent, params });
      dispatch(signersBalance(await provider!.getBalance(signer.evmAddress)));
    } catch (e: any) {
      dispatch(compiledContractError(e.message ? e.message : e));
    }
  };
  const submitInline = async (value: string) => {
    try {
      const params = prepareParameters(value);
      await submitDeploy({ ...partialDeployContent, params });
      dispatch(signersBalance(await provider!.getBalance(signer.evmAddress)));
    } catch (e: any) {
      dispatch(compiledContractError(e.message ? e.message : e));
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
};

export default ContractDeploy;


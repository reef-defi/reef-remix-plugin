import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSigner, submitDeploy } from "../../api/contract";
import { StateType } from "../../store/reducers";
import { getConstructor, prepareContractParams } from "../../utils";
import { CompiledContract, ABIParameter } from "@remixproject/plugin-api/lib/compiler/type";
import InlineFunction from "../common/InlineFunction";

interface InlineDeployProps {
  signerAddress: string;
  contract: CompiledContract;
  onOpen: () => void;
}


const InlineDeploy = ({ onOpen, contract, signerAddress } : InlineDeployProps) => {
  const dispatch = useDispatch();
  const {signers} = useSelector((state: StateType) => state.signers);
  const { errorMessage } = useSelector((state: StateType) => state.contracts);

  const abi = getConstructor(contract.abi)!;
  const signer = getSigner(signers, signerAddress);
  const parameters = abi.inputs! as ABIParameter[];

  const submit = async (value: string) => {
    const params = prepareContractParams(value, parameters);
    await submitDeploy(params, contract, signer.signer, dispatch);
  };

  return <InlineFunction
    name="Deploy"
    parameters={parameters}
    errorMessage={errorMessage}
    onOpen={onOpen}
    submit={submit}
  />
}

export default InlineDeploy;
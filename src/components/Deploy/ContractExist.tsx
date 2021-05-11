import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSigner, submitDeploy } from "../../api/contract";
import { StateType } from "../../store/reducers";
import { getConstructor } from "../../utils";
import { CompiledContract } from "@remixproject/plugin-api/lib/compiler/type";
import CollapsedDeploy from "./CollapsedDeploy";
import InlineDeploy from "./InlineDeploy";

interface ContractExistProps {
  signerAddress: string;
  contract: CompiledContract;
}

const ContractExist = ({contract, signerAddress}: ContractExistProps) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const {signers} = useSelector((state: StateType) => state.signers);

  const signer = getSigner(signers, signerAddress)
  const constructorAbi = getConstructor(contract.abi);
  const submit = async () => await submitDeploy([], contract, signer.signer, dispatch);

  if (!constructorAbi) {
    return (
      <div>
        <a className="btn btn-outline-light btn-text" onClick={submit}>Deploy</a>
      </div>
    );
  } else {
    return open
      ? <CollapsedDeploy contract={contract} signerAddress={signerAddress} onClose={() => setOpen(false)}/>
      : <InlineDeploy contract={contract} signerAddress={signerAddress} onOpen={() => setOpen(true)} />
  }
}

export default ContractExist;
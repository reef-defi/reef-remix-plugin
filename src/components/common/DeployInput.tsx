import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "../../store/reducers";
import { CompiledContract, ABIDescription, ABIParameter } from "@remixproject/plugin-api/lib/compiler/type";
import Loading from "./Loading";
import { getSigner, submitDeploy } from "../../api/contract";
import { getConstructor, prepareContractParams } from "../../utils";

interface DeployInputProps {
  signerAddress: string;
  contractName: string;
}

const DeployInput = ({signerAddress, contractName} : DeployInputProps) => {  
  const {deploying, contracts} = useSelector((state: StateType) => state.contracts);
  const contractExist = contractName in contracts;

  if (deploying) {
    return <Loading />;
  }

  return (
    <div className="mt-3">
      { contractExist && 
        <ContractExist 
          signerAddress={signerAddress}
          contract={contracts[contractName].payload}
        />
      }
    </div>
  );
}

export default DeployInput;


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
      : <InlineInputDeploy contract={contract} signerAddress={signerAddress} onOpen={() => setOpen(true)} />
  }
}

interface InlineInputDeployProps {
  signerAddress: string;
  contract: CompiledContract;
  onOpen: () => void;
}



const InlineInputDeploy = ({ onOpen, contract, signerAddress } : InlineInputDeployProps) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState("");
  const {signers} = useSelector((state: StateType) => state.signers);
  const { errorMessage } = useSelector((state: StateType) => state.contracts);

  const abi = getConstructor(contract.abi)!;
  const signer = getSigner(signers, signerAddress);
  const parameters = abi.inputs! as ABIParameter[];

  const submit = async () => {
    const params = prepareContractParams(value, parameters);
    await submitDeploy(params, contract, signer.signer, dispatch);
  };

  const placeholder = parameters
    .reduce((acc, inp) => (`${acc}${inp.type} ${inp.name}, `), "");

  return (
    <div>
      <div className="d-flex flex-row align-items-center">
        <div className="input-group">
          <div className="input-group-prepend">
            <a className="btn btn-outline-light btn-text" onClick={submit}>
              Deploy
            </a>
          </div>
          <input 
            value={value}
            placeholder={placeholder.slice(0, placeholder.length-2)}
            className="form-control"
            onChange={(event) => setValue(event.target.value)}
          />
        </div>
        <svg onClick={onOpen} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-arrow-down text-light border rounded-circle ml-1" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>
        </svg>
      </div>
      { errorMessage && 
        <div className="text-danger mt-2">
          {errorMessage}
        </div>
      }
    </div>
  );
}

interface ControlledDeployProps {
  signerAddress: string;
  contract: CompiledContract;
  onClose: () => void;
}

const CollapsedDeploy = ({contract, signerAddress, onClose}: ControlledDeployProps) => {
  const dispatch = useDispatch();
  const {signers} = useSelector((state: StateType) => state.signers);
  const { errorMessage } = useSelector((state: StateType) => state.contracts);

  const abi = getConstructor(contract.abi)!;
  const signer = getSigner(signers, signerAddress);
  const parameters = abi.inputs! as ABIParameter[];

  const [values, setValues] = useState<string[]>(Array(parameters.length).fill(""));

  const onChange = (value: string, index: number) => setValues([
    ...values.slice(0, index),
    value,
    ...values.slice(index+1, values.length)
  ]);

  const submit = async () => {
    await submitDeploy(values, contract, signer.signer, dispatch);
  };

  const attributesView = values
    .map((value, index) => (
      <div className="form-group row" key={index}>
        <label className="col-3 lead m-auto">{parameters[index].name}</label>
        <div className="col-9">
          <input 
            value={value}
            placeholder={parameters[index].type}
            className="form-control"
            onChange={(event) => onChange(event.target.value, index)}
          /> 
        </div>
      </div>
    ));

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <span className="text-light">DEPLOY</span>
        <svg onClick={onClose} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-arrow-up text-light border rounded-circle ml-1" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
        </svg>
      </div>

      <div className="mt-1">
        { attributesView }
      </div>
      
      <div className="d-flex justify-content-end mt-1">
        <a className="btn btn-outline-light btn-text" onClick={submit}>
          transact
        </a>
      </div>
      { errorMessage && 
        <div className="text-danger mt-2">{errorMessage}</div>
      }
    </div>
  )
}
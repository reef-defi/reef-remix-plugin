import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSigner, submitDeploy } from "../../api/contract";
import { StateType } from "../../store/reducers";
import { getConstructor } from "../../utils";
import { CompiledContract, ABIParameter } from "@remixproject/plugin-api/lib/compiler/type";

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

export default CollapsedDeploy;
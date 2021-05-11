import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSigner, submitDeploy } from "../../api/contract";
import { StateType } from "../../store/reducers";
import { getConstructor, prepareContractParams } from "../../utils";
import { CompiledContract, ABIParameter } from "@remixproject/plugin-api/lib/compiler/type";

interface InlineDeployProps {
  signerAddress: string;
  contract: CompiledContract;
  onOpen: () => void;
}


const InlineDeploy = ({ onOpen, contract, signerAddress } : InlineDeployProps) => {
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

export default InlineDeploy;
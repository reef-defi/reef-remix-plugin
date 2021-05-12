import React, { useState } from "react"
import { Contract, Signer } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { getSigner } from "../../api/contract";
import { StateType } from "../../store/reducers";
import { contractAdd } from "../../store/actions/contracts";

interface ContractRetrieveProps {
  contractName: string;
  signerAddress: string;
}

const ContractRetrieve = ({contractName, signerAddress} : ContractRetrieveProps) => {
  const dispatch = useDispatch();
  const [address, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {signers} = useSelector((state: StateType) => state.signers);
  const {contracts} = useSelector((state: StateType) => state.compiledContracts);

  const signer = getSigner(signers, signerAddress)
  const contractAbi = contracts[contractName].payload.abi;
  
  const findContract = async () => {
    setErrorMessage("");
    try {
      const contract = new Contract(address, contractAbi, signer.signer as Signer);
      dispatch(contractAdd(contractName, contract));
    } catch (e) {
      setErrorMessage(e.message);
    }
  };

  return (
    <div>
      <div className="row flex-fill m-0">
        <div className="col-4 p-0">
          <a
            onClick={findContract}
            style={{"fontSize": "14px"}}
            className="btn btn-outline-light btn-text w-100"
          >
            At address
          </a>
        </div>
        <div className="col-8 p-0">
          <input 
            value={address}
            placeholder="Address"
            className="form-control"
            onChange={(event) => setAddress(event.target.value)}
          />
        </div>
      </div>
      <div className="mt-1 text-danger">
        {errorMessage && errorMessage}
      </div>
    </div>
  )
}

export default ContractRetrieve;
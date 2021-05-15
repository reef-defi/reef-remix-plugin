import React, { useState } from "react"
import { Contract, Signer } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { getSigner } from "../../api/contract";
import { StateType } from "../../store/reducers";
import { contractAdd } from "../../store/actions/contracts";
import { ABIParameter } from "@remixproject/plugin-api/lib/compiler/type";
import Function from "../Function/Function";

interface ContractRetrieveProps {
  contractName: string;
  signerAddress: string;
}

const contractRetrievialParameters = (): ABIParameter[] => [{
  name: "",
  type: "Load contract from Address"
}];

const ContractRetrieve = ({contractName, signerAddress} : ContractRetrieveProps) => {
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");

  const {signers} = useSelector((state: StateType) => state.signers);
  const {contracts} = useSelector((state: StateType) => state.compiledContracts);

  const signer = getSigner(signers, signerAddress)
  const contractAbi = contracts[contractName].payload.abi;
  
  const findContract = async (address: string) => {
    setErrorMessage("");
    try {
      const contract = new Contract(address, contractAbi, signer.signer as Signer);
      dispatch(contractAdd(contractName, contract));
    } catch (e) {
      setErrorMessage(e.message);
    }
  };

  return (
    <Function
      name="At address"
      parameters={contractRetrievialParameters()}
      text={errorMessage}
      error={true}
      submitInline={findContract}
      submitCollapse={(addresses: string[]) => findContract(addresses[0])}
    />
  );
}

export default ContractRetrieve;
import React, { useState } from "react"
import { Contract, Signer } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { getSigner } from "../../api";
import { StateType } from "../../store/reducers";
import { contractAdd } from "../../store/actions/contracts";
import { ABIParameter } from "@remixproject/plugin-api/lib/compiler/type";
import Function from "../Function/Function";

interface ContractRetrieveProps {
  contractName: string;
}

const contractRetrievialParameters = (): ABIParameter[] => [{
  name: "",
  type: "Load contract from Address"
}];

const ContractRetrieve = ({contractName} : ContractRetrieveProps) => {
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");

  const {signers, index} = useSelector((state: StateType) => state.signers);
  const {contracts} = useSelector((state: StateType) => state.compiledContracts);

  const signer = signers[index];
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
      isReturn={false}
      submitInline={findContract}
      submitCollapse={(addresses: string[]) => findContract(addresses[0])}
    />
  );
}

export default ContractRetrieve;
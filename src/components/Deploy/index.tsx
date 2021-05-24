import React from "react";
import { useSelector } from "react-redux";
import { StateType } from "../../store/reducers";
import Loading from "../common/loading/Loading";
import ContractDeploy from "./ContractDeploy";
import ContractRetrieve from "./ContractRetrieve";

interface DeployInputProps {
  contractName: string;
}

const DeployInput = ({contractName} : DeployInputProps) => {  
  const {deploying, contracts} = useSelector((state: StateType) => state.compiledContracts);
  const contractExist = contractName in contracts;

  if (deploying) {
    return <Loading />;
  }

  return (
    <div className="mt-3">
      { contractExist &&
        <>
          <ContractDeploy 
            contractName={contractName}
            />
          <div className="lead text-color text-center mb-2">
            OR
          </div>
          <ContractRetrieve
            contractName={contractName}
          />
        </>
      }
    </div>
  );
}

export default DeployInput;
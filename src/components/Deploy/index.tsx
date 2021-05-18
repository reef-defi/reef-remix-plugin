import React from "react";
import { useSelector } from "react-redux";
import { StateType } from "../../store/reducers";
import Loading from "../common/loading/Loading";
import ContractDeploy from "./ContractDeploy";
import ContractRetrieve from "./ContractRetrieve";

interface DeployInputProps {
  signerAddress: string;
  contractName: string;
}

const DeployInput = ({signerAddress, contractName} : DeployInputProps) => {  
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
            signerAddress={signerAddress}
            contractName={contractName}
            />
          <div className="lead text-color text-center">
            OR
          </div>
          <ContractRetrieve
            signerAddress={signerAddress}
            contractName={contractName}
          />
        </>
      }
    </div>
  );
}

export default DeployInput;
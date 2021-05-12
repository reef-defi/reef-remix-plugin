import React from "react"
import { useSelector } from "react-redux";
import { StateType } from "../../store/reducers";
import ContractView from "./ContractView";

interface DeployedContractsProps {

}

const DeployedContracts = ({} : DeployedContractsProps) => {
  const { contracts } = useSelector((state: StateType) => state.contracts);
  console.log("Contracts: ", contracts);
  const contractViews = contracts
  .map((contract) => (
    <ContractView
      contract={contract.contract}
    />
  ))
  return (
    <div className="mt-3 pb-2 border-bottom border-secondary">
      <div className="d-flex justify-content-between align-items-center">
        <span className="text-light">Deployed contracts</span>

        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-trash text-light" viewBox="0 0 16 16">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
          <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg>
      </div>

      <div>
        {contractViews}
      </div>
    </div>
  );
}

export default DeployedContracts;
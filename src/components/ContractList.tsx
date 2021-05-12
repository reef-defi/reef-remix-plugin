import React from "react"
import { useSelector } from "react-redux";
import { StateType } from "../store/reducers";

interface ContractListProps {

}

const ContractList = ({} : ContractListProps) => {
  const {contracts} = useSelector((state: StateType) => state.contracts);
  console.log(contracts);
  return (
    <div className="mt-1">
      {/* { contracts } */}
    </div>
  );
}

export default ContractList;
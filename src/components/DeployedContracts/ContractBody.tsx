import React, { useState } from "react"
import { Contract } from "ethers";
import { useSelector } from "react-redux";
import { StateType } from "../../store/reducers";
import { CompiledContract, ABIParameter } from "@remixproject/plugin-api/lib/compiler/type";


interface ContractBodyProps {
  contract: Contract;
}

const ContractBody = ({contract} : ContractBodyProps) => {
  const {contracts} = useSelector((state: StateType) => state.contracts);
  // contract.
  // const abi = Object.keys(contracts)
  // .find((name) => contracts[name].)


  // const abi = Array(8);
  console.log("Contract: ", contract);

  // const [open, setOpen] = useState(Array(abi.length).fill(false));
  // const [output, setOutput] = useState(Array(abi.length).fill(""));
  // const [errors, setErrors] = useState(Array(abi.length).fill(false));
  
  return (
    <div></div>
  );
}

export default ContractBody;
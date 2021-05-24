import React, { useState } from "react"
import ContractBody from "./ContractBody";
import ContractHeader from "./ContractHeader";
import { ContractHolder } from "../../store/localState";
import { useDispatch } from "react-redux";
import { contractRemove, contractRemoveAll } from "../../store/actions/contracts";


interface ContractViewProps extends ContractHolder { 
  index: number;
}

const ContractView = (params : ContractViewProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const onRemove = () =>
    dispatch(contractRemove(params.index));

  return (
    <div className="mt-1">
      <ContractHeader
        open={open}
        isLoading={isLoading}
        address={params.contract.address}
        onRemove={onRemove}
        onClick={() => setOpen(!open)}
      />
      { open && <ContractBody {...params} isLoading={isLoading} setIsLoading={setIsLoading} /> }
    </div>
  );
}

export default ContractView;

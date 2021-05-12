import React, { useState } from "react"
import ContractBody from "./ContractBody";
import ContractHeader from "./ContractHeader";
import { ContractHolder } from "../../state";


interface ContractViewProps extends ContractHolder { }

const ContractView = (params : ContractViewProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-1">
      <ContractHeader
        open={open}
        address="5E7JRY3q2e2HT6Mv4WhSA5Qn64B8hTZaUq2sN66ePJrrHYeJ"
        onClick={() => setOpen(!open)}
        onRemove={() => {}}
      />
      { open && <ContractBody {...params} /> }
    </div>
  );
}

export default ContractView;

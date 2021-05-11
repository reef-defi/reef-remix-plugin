import React, { useEffect, useState } from "react"

import { isWeb3Injected, web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import { useSelector } from "react-redux";
import { StateType } from "../store/reducers";
import DeployInput from "./common/DeployInput";
import ContractList from "./ContractList";

interface ConstructorProps {
}

const Constructor = ({} : ConstructorProps) => {
  const { signers } = useSelector((state: StateType) => state.signers);

  const [account, setAccount] = useState(signers.length > 0 
    ? signers[0].address 
    : ""
  );
  const [selectedContract, setSelectedContract] = useState("");

  const contracts = useSelector((state: StateType) => state.contracts);
  console.log(contracts);

  useEffect(() => {
    const names = Object.keys(contracts.contracts);
    if (names.length > 0) {
      setSelectedContract(names[0]);
    }
  }, [contracts]);

  const signerOptions = signers
    .map(({address}, index) => (
      <option value={address} key={index}>{address}</option>
    ));

  const contractOptions = Object
    .keys(contracts.contracts)
    .map((contract, index) => (
      <option value={contract} key={index}>
        {contract}
      </option>
    ));

  return (
    <div className="m-3">
      <div>
        <label>
          Accounts:
        </label>

        <select
          id="accountSelector"
          className="form-select"
          value={account}
          onChange={(event) => setAccount(event.target.value)}
        >
          { signerOptions }
        </select>
      </div>
      <div>
        <label>
          Compiled contracts:
        </label>

        <select
          className="form-select"
          value={selectedContract}
          onChange={(event) => setSelectedContract(event.target.value)}
        >
          { contractOptions }
        </select>
      </div>

      <DeployInput 
        contractName={selectedContract}
        signerAddress={account}
      />

      <ContractList />
    </div>
  );
}

export default Constructor;
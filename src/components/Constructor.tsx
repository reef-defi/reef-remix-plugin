import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { isWeb3Injected, web3Accounts, web3Enable } from "@polkadot/extension-dapp";

import { StateType } from "../store/reducers";
import Deploy from "./Deploy";
import DeployedContracts from "./DeployedContracts";

interface ConstructorProps { }

const Constructor = ({} : ConstructorProps) => {
  const {contracts} = useSelector((state: StateType) => state.compiledContracts);

  const { signers } = useSelector((state: StateType) => state.signers);
  const [account, setAccount] = useState(signers.length > 0 ? signers[0].address : "");

  const [selectedContract, setSelectedContract] = useState("");


  useEffect(() => {
    const names = Object.keys(contracts);
    if (names.length > 0) {
      setSelectedContract(names[0]);
    }
  }, [contracts]);

  const signerOptions = signers
    .map(({address}, index) => (
      <option value={address} key={index}>{address}</option>
    ));

  const contractOptions = Object
    .keys(contracts)
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

      <Deploy 
        contractName={selectedContract}
        signerAddress={account}
      />
      
      <DeployedContracts />
    </div>
  );
}

export default Constructor;
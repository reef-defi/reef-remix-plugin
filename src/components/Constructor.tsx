import React, { useEffect, useState } from "react"

import { isWeb3Injected, web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import { RemixSigner } from "../state/signers";
import { useSelector } from "react-redux";
import { StateType } from "../store/reducers";
import DeployInput from "./common/DeployInput";

interface ConstructorProps {
  signers: RemixSigner [];
}

const Constructor = ({signers} : ConstructorProps) => {
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

  // useEffect(() => {
  //   console.log(isWeb3Injected);
  //   web3Enable("reef-remix-plugin")
  //     .then(() => web3Accounts())
  //     .then((accounts) => {
  //       console.log(accounts)
  //       setText("Loaded successfully")
  //     })
  //     .catch((err) => {
  //       setText("Error: " + err.message);
  //     });
  // }, [])

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

      <DeployInput />
    </div>
  );
}

export default Constructor;
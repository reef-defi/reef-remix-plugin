import React, { useEffect, useState } from "react"

import { isWeb3Injected, web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import { RemixSigner } from "../state/signers";

interface ConstructorProps {
  signers: RemixSigner [];
}

const Constructor = ({signers} : ConstructorProps) => {
  const [account, setAccount] = useState(signers.length > 0 
    ? signers[0].address 
    : ""
  );

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
    .map(({address}) => (
      <option value={address}>{address}</option>
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
          defaultValue={account}
          onChange={(event) => setAccount(event.target.value)}
        >
          { signerOptions }
        </select>
      </div>
    </div>
  );
}

export default Constructor;
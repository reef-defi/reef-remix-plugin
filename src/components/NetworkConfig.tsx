import React, { useState } from "react"
import { isWeb3Injected } from "@polkadot/extension-dapp";

interface NetworkConfigProps {
  errorMessage: string;
  submit: (url: string, mnemonics: string[]) => void;
}

enum ReefNetwork {
  Localhost="ws://127.0.0.1:9944",
  Testnet="wss://rpc-testnet.reefscan.com/ws",
  Mainnet="",
}

const NetworkConfig = ({errorMessage, submit} : NetworkConfigProps) => {
  const [url, setUrl] = useState(ReefNetwork.Localhost);
  const [accounts, setAccounts] = useState([""]);

  const addAccount = () => setAccounts([...accounts, ""]);
  const removeAccount = () => setAccounts(accounts.slice(0, accounts.length-1));
  const changeAccount = (text: string, index: number) => setAccounts([
    ...accounts.slice(0, index),
    text,
    ...accounts.slice(index+1, accounts.length)
  ]);

  const accountsView = accounts.map((account, index) => (
    <input 
      key={index}
      value={account}
      placeholder="Account mnemonic"
      className="form-control text w-100 mt-1"
      onChange={(event) => changeAccount(event.target.value, index)} />
  ));
  
  // TODO when the mainet is published update its select option with correct url!
  return (
    <div className="m-3">
      <form className="mt-4">
        <div className="form-group">
          <label htmlFor="reefRpcUrl">Reef node url:</label>
          {/* <input type="email" className="form-control text mt-1" id="reefRpcUrl" value={url} onChange={(event) => setUrl(event.currentTarget.value)} placeholder="ws://127.0.0.1:9944"/> */}
          <select 
            id="reefRpcUrl"
            className="form-control select_3rUxUe custom-select flex-fill mr-1"
            value={url}
            onChange={(event) => setUrl(event.target.value as ReefNetwork)}
          >
            <option value={ReefNetwork.Localhost}>Localhost ({ReefNetwork.Localhost})</option>
            <option value={ReefNetwork.Testnet}>Reef Testnet ({ReefNetwork.Testnet})</option>
            {/* <option value="">Reef Mainnet</option> */}
          </select>
        </div>
        <div className="justify-content-between d-flex flex-row align-items-center">
          <label>Inject accounts: </label>
          <div>
            <a className="btn btn-info mr-1" onClick={addAccount}>+</a>
            <a className="btn btn-info" onClick={removeAccount}>-</a>
          </div>
        </div>

        <div>
          { accountsView }
        </div>
        <div className="d-flex justify-content-end">
          <a className="btn btn-warning mt-1" onClick={() => submit(url, accounts)}>Connect</a>
        </div>
      </form>
      <small className="form-text text-danger">{errorMessage}</small>
      {/* { !isWeb3Injected && 
        <div className="text-danger mt-3">
          *Install polkadot extension in your browser
        </div>
      } */}
    </div>
  );
}

export default NetworkConfig;
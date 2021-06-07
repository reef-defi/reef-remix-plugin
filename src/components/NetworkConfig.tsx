import React, { useState } from "react"

interface NetworkConfigProps {
  errorMessage: string;
  submit: (url: string, mnemonics: string[], verificationUrl?: string) => void;
}

enum NetworkName {
  Localhost="Localhost",
  Mainnet="Mainnet",
  Testnet="Testnet",
}

interface SubNetwork {
  url: string;
  verificationUrl?: string;
}

type Network = {
  [key in NetworkName]: SubNetwork;
};

const Network: Network = {
  Localhost: {
    url: "ws://127.0.0.1:9944",
  },
  Testnet: {
    url: "wss://rpc-testnet.reefscan.com/ws",
    verificationUrl: "https://testnet.reefscan.com/api/verificator/untrusted-request"
  },
  Mainnet: {
    url: "wss://rpc.reefscan.com/ws",
    verificationUrl: "https://reefscan.com/api/verificator/untrusted-request"
  }
}

const NetworkConfig = ({errorMessage, submit} : NetworkConfigProps) => {
  const [network, setNetwork] = useState(NetworkName.Mainnet);
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
  
  return (
    <div className="m-3">
      <form className="mt-4">
        <div className="form-group">
          <label htmlFor="reefRpcUrl">Reef node url:</label>
          <select 
            id="reefRpcUrl"
            className="form-control select_3rUxUe custom-select flex-fill mr-1"
            value={network}
            onChange={(event) => setNetwork(event.target.value as NetworkName)}
          >
            <option value={NetworkName.Localhost}>Localhost ({Network.Localhost.url})</option>
            <option value={NetworkName.Testnet}>Reef Testnet ({Network.Testnet.url})</option>
            <option value={NetworkName.Mainnet}>Reef Mainnet ({Network.Mainnet.url})</option>
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
          <a className="btn btn-warning mt-1" onClick={() => submit(Network[network].url, accounts, Network[network].verificationUrl)}>Connect</a>
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
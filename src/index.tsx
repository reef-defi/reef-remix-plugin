import React from "react";
import ReactDOM from "react-dom";
import { PluginClient } from "@remixproject/plugin";
import { createClient } from "@remixproject/plugin-iframe";

import { web3Enable, web3Accounts, web3EnablePromise, isWeb3Injected } from "@polkadot/extension-dapp";

import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

declare global {
  interface Window {
    injectedWeb3: any
  }
};


const client = createClient(new PluginClient());


client.onload(async () => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
    );
    
    reportWebVitals();
});


import React, { Dispatch } from "react";
import ReactDOM from "react-dom";
import { Client, PluginClient } from "@remixproject/plugin";
import { createClient } from "@remixproject/plugin-iframe";

import { IRemixApi } from "@remixproject/plugin-api";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { configureStore } from "./store";
import { Provider } from "react-redux";
import { StateType } from "./store/reducers";
import { compiledContractLoad } from "./store/actions/compiledContracts";

import { Signer, Provider as EvmProvider } from "@reef-defi/evm-provider";
import { WsProvider } from "@polkadot/api";
import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
  web3ListRpcProviders,
  web3UseRpcProvider,
} from "@polkadot/extension-dapp";

import { ethers } from "ethers";

declare global {
  interface Window {
    injectedWeb3: any;
  }
}

const store = configureStore();

type IClient = Client<any, Readonly<IRemixApi>>;
type IDispatch = typeof store.dispatch;

const client = createClient(new PluginClient());

const FlipperAbi = [
  {
    inputs: [
      {
        internalType: "bool",
        name: "initvalue",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "flip",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "get",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

client.onload(async () => {
  const polkadotjs = await client.call("reefProvider", "initExtension");

  const accounts = await client.call("reefProvider", "accounts");

  console.log("ACC", accounts);

  const sign = await client.call("reefProvider", "sign", accounts[0].address);

  console.log("sign", sign);

  //await signer.claimDefaultAccount();
  //.catch((error) => console.error(error));
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
  );

  reportWebVitals();

  await initPlugin(client, store.dispatch);
});

const initPlugin = async (client: IClient, dispatch: IDispatch) => {
  const result = await client.solidity.getCompilationResult();
  dispatch(compiledContractLoad(result.data));

  client.solidity.on("compilationFinished", async () => {
    const result = await client.solidity.getCompilationResult();
    dispatch(compiledContractLoad(result.data));
  });
};


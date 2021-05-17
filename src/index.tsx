import React, { Dispatch } from "react";
import ReactDOM from "react-dom";
import { Client, PluginClient } from "@remixproject/plugin";
import { createClient } from "@remixproject/plugin-iframe";

import { web3Enable, web3Accounts, web3EnablePromise, isWeb3Injected } from "@polkadot/extension-dapp";
import { IRemixApi } from '@remixproject/plugin-api';
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { configureStore } from "./store";
import { Provider } from "react-redux";
import { StateType } from "./store/reducers";
import { compiledContractLoad } from "./store/actions/compiledContracts";

declare global {
  interface Window {
    injectedWeb3: any
  }
};

const store = configureStore();

type IClient = Client<any, Readonly<IRemixApi>>;
type IDispatch = typeof store.dispatch;

const client = createClient(new PluginClient());


client.onload(async () => {
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App notify={notify} />
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  );
    
  reportWebVitals();

  await initPlugin(client, store.dispatch);
});

const notify = (message: string) => {
  // TODO access remix toaster when its availabel <- currently it is not
}

const initPlugin = async (client: IClient, dispatch: IDispatch) => {
  const result = await client.solidity.getCompilationResult()
  dispatch(compiledContractLoad(result.data));

  client.solidity.on('compilationFinished', async () => {
    const result = await client.solidity.getCompilationResult()
    dispatch(compiledContractLoad(result.data));
  })
}
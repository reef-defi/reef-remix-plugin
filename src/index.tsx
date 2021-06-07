import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { configureStore } from "./store";
import { compiledContractLoad, ContractSourceContent } from "./store/actions/compiledContracts";

import { createClient } from "@remixproject/plugin-iframe";
import { Client, PluginClient } from "@remixproject/plugin";
import { IRemixApi } from '@remixproject/plugin-api';
import "./index.css";

// declare global {
//   interface Window {
//     injectedWeb3: any
//   }
// };

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
  // TODO try out status changes
  client.emit('statusChange', { key: 'success', type: 'success', title: message });
}

// TODO Javascript VM is in client.udapp !!!

const initPlugin = async (client: IClient, dispatch: IDispatch) => {
  // const result = await client.solidity.getCompilationResult()
  // dispatch(compiledContractLoad(result.data));

  // TODO maybe try allowing polkadot-extension ??
  // client.options.allowOrigins = [

  // ]

  client.solidity.on('compilationFinished', async (fileName, source, languageVersion, data) => {
    const [version, optimization, runs] = languageVersion.split(";");
    dispatch(compiledContractLoad(
      data,
      optimization === "true",
      parseInt(runs),
      version,
      source as unknown as ContractSourceContent
    ));
  })
}
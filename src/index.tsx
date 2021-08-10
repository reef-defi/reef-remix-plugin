import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { configureStore } from "./store";
import { NotificationType, setNotifyAction } from "./store/actions/utils";
import { compiledContractLoad, ContractSourceContent } from "./store/actions/compiledContracts";

import { IRemixApi } from '@remixproject/plugin-api';
import { createClient } from "@remixproject/plugin-webview";
import { Client, PluginClient } from "@remixproject/plugin";
import "./index.css";

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

const notify = (message: string, type: NotificationType="html") => {
  client.terminal.log({
    type,
    value: message
  });
}

// TODO maybe try allowing polkadot-extension ??
// client.options.allowOrigins = [

  // ]
// TODO Javascript VM is in client.udapp !!!

const initPlugin = async (client: IClient, dispatch: IDispatch) => {
  dispatch(setNotifyAction(notify));

  client.solidity.on('compilationFinished', async (_, source, languageVersion, data) => {
    const [version, optimization, runs] = languageVersion.split(";");
    dispatch(compiledContractLoad(
      data,
      optimization === "true",
      parseInt(runs),
      version,
      source as unknown as ContractSourceContent
    ));
  });
}
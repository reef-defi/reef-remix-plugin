import { WsProvider } from '@polkadot/api';
import { Provider } from '@reef-defi/evm-provider';
import React, { useState } from 'react';
import Loading from './components/Loading';
import Network from './components/NetworkConfig';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<Provider|undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState("");

  const submit = async (url: string) => {
    const newProvider = new Provider({
      provider: new WsProvider(url),
    });

    setIsLoading(true);
    try {
      await (await newProvider.resolveApi).isReady
      setProvider(newProvider);
    } catch (e) {
      setErrorMessage(e.message);
      setProvider(undefined);
    }
    setIsLoading(false);
  };


  return (
    <div className="app">
      {isLoading && <Loading />}
      {(!isLoading && !provider) && <Network errorMessage={errorMessage} submit={submit} />}
      {/* {(!isLoading && provider) && <Constructor />} */}
    </div>
  );
}

export default App;

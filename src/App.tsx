import { WsProvider, Keyring } from '@polkadot/api';
import { Provider, Signer, TestAccountSigningKey } from '@reef-defi/evm-provider';
import React, { useEffect, useState } from 'react';
import Constructor from './components/Constructor';
import Loading from './components/common/loading/Loading';
import Network from './components/NetworkConfig';
import { KeyringPair } from "@polkadot/keyring/types";
import { RemixSigner } from './state/signers';
import { useDispatch, useSelector } from 'react-redux';
import { signersLoad, signersSelect } from './store/actions/signers';
import { NotifyFun, setNotifyAction, setProviderAction } from './store/actions/utils';
import { StateType } from './store/reducers';

const createSeedKeyringPair = (seed: string): KeyringPair => {
  const keyring = new Keyring({ type: "sr25519" });
  return keyring.addFromUri(seed);
};

const extractAddress = (provider: Provider) => async (wallet: Signer): Promise<RemixSigner> => {
  const address = await wallet.getAddress();
  const balance = await provider.getBalance(address);
  return {
    address,
    balance,
    signer: wallet,
  }
}

const connectWallets = (provider: Provider, mnemonics: string[]): Signer[] => {
  const signingKeys = new TestAccountSigningKey(provider.api.registry);
  const pairs = mnemonics
    .map((mnemonic) => createSeedKeyringPair(mnemonic));

  signingKeys.addKeyringPair(pairs);

  const signers = pairs
    .map((pair) => new Signer(provider, pair.address, signingKeys));
    
  return signers;
} 

interface App {
  notify: NotifyFun;
}

const App = ({ notify }: App) => {
  const dispatch = useDispatch();
  const {provider} = useSelector((state: StateType) => state.utils);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    dispatch(setNotifyAction(notify));
  }, [])

  const submit = async (url: string, mnemonics: string[]) => {
    const newProvider = new Provider({provider: new WsProvider(url)});
    try {
      setIsLoading(true);
      await (await newProvider.resolveApi).isReady;
      const wallets = await Promise.all(
        connectWallets(newProvider, mnemonics)
          .map(extractAddress(newProvider))
      );
      dispatch(setProviderAction(newProvider));
      dispatch(signersLoad(wallets));

      if (wallets.length > 0) {
        dispatch(signersSelect(0))
      }
    } catch (e) {
      setErrorMessage(e.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="app">
      {isLoading && <Loading />}
      {(!isLoading && !provider) && <Network errorMessage={errorMessage} submit={submit} />}
      {(!isLoading && provider) && <Constructor />}
    </div>
  );
}

export default App;

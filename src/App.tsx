import { WsProvider, Keyring } from '@polkadot/api';
import { Provider, Signer, TestAccountSigningKey } from '@reef-defi/evm-provider';
import React, { useEffect, useState } from 'react';
import Constructor from './components/Constructor';
import Loading from './components/common/loading/Loading';
import Network from './components/NetworkConfig';
import { ReefSigner } from '@reef-defi/hardhat-reef/dist/src/proxies/signers/ReefSigner';
import { KeyringPair } from "@polkadot/keyring/types";
import { RemixSigner } from './state/signers';
import { useDispatch } from 'react-redux';
import { signersLoad } from './store/actions/signers';
import { NotifyFun, setNotifyAction } from './store/actions/utils';

const createSeedKeyringPair = (seed: string): KeyringPair => {
  const keyring = new Keyring({ type: "sr25519" });
  return keyring.addFromUri(seed);
};

const extractAddress = (provider: Provider) => async (wallet: ReefSigner): Promise<RemixSigner> => {
  const address = await wallet.getAddress();
  const balance = await provider.getBalance(address);
  return {
    address,
    balance,
    signer: wallet,
  }
}

const connectWallets = (provider: Provider, mnemonics: string[]): ReefSigner[] => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<Provider|undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setNotifyAction(notify));
  }, [])

  const submit = async (url: string, mnemonics: string[]) => {
    const newProvider = new Provider({
      provider: new WsProvider(url),
    });
    setIsLoading(true);
    try {
      await (await newProvider.resolveApi).isReady;
      setProvider(newProvider);
      const wallets = await Promise.all(
        connectWallets(newProvider, mnemonics)
          .map(extractAddress(newProvider))
      );
      dispatch(signersLoad(wallets));
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
      {(!isLoading && provider) && <Constructor />}
    </div>
  );
}

export default App;

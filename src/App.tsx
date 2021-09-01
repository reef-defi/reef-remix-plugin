import { WsProvider, Keyring } from "@polkadot/api";
import {
  Provider,
  Signer,
  TestAccountSigningKey,
} from "@reef-defi/evm-provider";
import React, { useState } from "react";
import Constructor from "./components/Constructor";
import Loading from "./components/common/Loading";
import Network from "./components/NetworkConfig";
import { ReefSigner } from "@reef-defi/hardhat-reef/dist/src/proxies/signers/ReefSigner";
import { KeyringPair } from "@polkadot/keyring/types";
import { RemixSigner } from "./state/signers";
import { useDispatch } from "react-redux";
import { signersLoad } from "./store/actions/signers";

const createSeedKeyringPair = (seed: string): KeyringPair => {
  const keyring = new Keyring({ type: "sr25519" });
  return keyring.addFromUri(seed);
};

const extractAddress = async (wallet: ReefSigner): Promise<RemixSigner> => ({
  address: await wallet.getAddress(),
  signer: wallet,
});

const connectWallets = (
  provider: Provider,
  mnemonics: string[]
): ReefSigner[] => {
  const signingKeys = new TestAccountSigningKey(provider.api.registry);
  const pairs = mnemonics.map((mnemonic) => createSeedKeyringPair(mnemonic));

  signingKeys.addKeyringPair(pairs);

  const signers = pairs.map(
    (pair) => new Signer(provider, pair.address, signingKeys)
  );

  return signers;
};

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<Provider | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

  const submit = async (url: string, mnemonics: string[]) => {
    const newProvider = new Provider({
      provider: new WsProvider(url),
    });

    setIsLoading(true);
    try {
      await (await newProvider.resolveApi).isReady;
      setProvider(newProvider);
      const wallets = await Promise.all(
        connectWallets(newProvider, mnemonics).map(extractAddress)
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
      {!isLoading && !provider && (
        <Network errorMessage={errorMessage} submit={submit} />
      )}
      {!isLoading && provider && <Constructor />}
    </div>
  );
};

export default App;

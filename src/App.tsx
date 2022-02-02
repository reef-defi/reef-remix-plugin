import { WsProvider, Keyring } from "@polkadot/api";
import {
  Provider,
  Signer,
  TestAccountSigningKey,
} from "@reef-defi/evm-provider";
import React, { useEffect, useState } from "react";
import Constructor from "./components/Constructor";
import Loading from "./components/common/loading/Loading";
import { useDispatch, useSelector } from "react-redux";
import {
  signersAdd,
  signersAddList,
  signersClear,
} from "./store/actions/signers";
import {
  NotifyFun,
  setNotifyAction,
  setProviderAction,
  setReefscanUrl,
} from "./store/actions/utils";
import { StateType } from "./store/reducers";
import { RemixSigner } from "./store/localState";
import { getNetworkSpec, NetworkName } from "./utils/network";
import { contractRemoveAll } from "./store/actions/contracts";
import Dot from "./components/common/Dot";
import {
  isWeb3Injected,
  web3Accounts,
  web3Enable,
} from "@reef-defi/extension-dapp";

import type { InjectedAccountWithMeta } from "@reef-defi/extension-inject/types";
import type { Signer as InjectedSigner } from "@polkadot/api/types";

// const extractAddress = async (provider: Provider, url: string, wallet: Signer): Promise<RemixSigner> => {
//   const isClaimed = await wallet.isClaimed();
//   const address = await wallet.getAddress();

//   if (!isClaimed) {
//     await wallet.claimDefaultAccount();
//   }
//   const balance = await provider.getBalance(address);
//   return {
//     address,
//     balance,
//     signer: wallet,
//   }
// }

const connectWallet = (provider: Provider, mnemonic: string): Signer => {
  const signingKeys = new TestAccountSigningKey(provider.api.registry);
  const keyring = new Keyring({ type: "sr25519" });
  const pair = keyring.addFromUri(mnemonic);
  signingKeys.addKeyringPair(pair);
  return new Signer(provider, pair.address, signingKeys);
};

interface App {
  notify: NotifyFun;
}

type Status = "loading" | "success" | "failed";

const accountToSigner = (provider: Provider, sign: InjectedSigner) => async (
  account: InjectedAccountWithMeta
): Promise<RemixSigner> => {
  const signer = new Signer(provider, account.address, sign);
  const evmAddress = await signer.getAddress();
  const isEvmClaimed = await signer.isClaimed();

  return {
    signer,
    evmAddress,
    isEvmClaimed,
    name: account.meta.name || "",
    genesisHash: account.meta.genesisHash,
    address: account.address,
    balance: await provider.getBalance(evmAddress),
  };
};

const App = ({ notify }: App) => {
  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const [status, setStatus] = useState<Status>("success");
  const [network, setNetwork] = useState(getNetworkSpec(NetworkName.Mainnet));

  useEffect(() => {
    dispatch(setNotifyAction(notify));
  }, []);

  useEffect(() => {
    const newProvider = new Provider({ provider: new WsProvider(network.url) });
    const load = async () => {
      try {
        setError("");
        setStatus("loading");
        dispatch(signersClear());
        dispatch(contractRemoveAll());
        await newProvider.api.isReadyOrError.catch(async (err) => {
          throw new Error(
            `There was an error when connecting to network ${network.name}... Check network status!`
          );
        });
        const inj = await web3Enable("reef-remix-plugin");
        if (inj.length === 0) {
          throw new Error(
            "Reef extension not detected. Please install it at: https://github.com/reef-defi/browser-extension"
          );
        }
        const accountsInj = await web3Accounts();
        const accounts = (
          await Promise.all(
            accountsInj.map(accountToSigner(newProvider, inj[0].signer))
          )
        ).filter(
          (account) =>
            !network.genesisHash ||
            !account.genesisHash ||
            account.genesisHash === network.genesisHash
        );
        dispatch(setReefscanUrl(network.reefscanUrl));
        dispatch(setProviderAction(newProvider));
        dispatch(signersAddList(accounts));
        setStatus("success");
      } catch (e: any) {
        console.log(e);
        setError(e.message);
        notify(e.message, "error");
        setStatus("failed");
      }
    };
    load();

    return () => {
      newProvider.api.disconnect();
    };
  }, [network]);

  return (
    <div className="app">
      <div className="d-flex justify-content-between px-3">
        <svg width="18" height="18" />

        <div className="dropdown">
          <span
            className="text-light cursor action-underline"
            id="dropdownNetwork"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {network.name}
            <Dot
              color={
                status === "loading"
                  ? "warning"
                  : status === "failed"
                  ? "danger"
                  : "success"
              }
            />
          </span>
          <ul
            className="dropdown-menu dropdown-menu-end network-dropdown"
            aria-labelledby="dropdownNetwork"
          >
            <li>
              <a
                className="dropdown-item text-light text-center"
                href="#"
                onClick={() => setNetwork(getNetworkSpec(NetworkName.Mainnet))}
              >
                Mainnet
              </a>
            </li>
            <li>
              <a
                className="dropdown-item text-light text-center"
                href="#"
                onClick={() => setNetwork(getNetworkSpec(NetworkName.Testnet))}
              >
                Testnet
              </a>
            </li>
            <li>
              <a
                className="dropdown-item text-light text-center"
                href="#"
                onClick={() =>
                  setNetwork(getNetworkSpec(NetworkName.Localhost))
                }
              >
                Localhost
              </a>
            </li>
          </ul>
        </div>

        <div className="dropdown">
          <svg
            width="18"
            height="18"
            fill="currentColor"
            className="bi bi-gear text-color cursor"
            viewBox="0 0 16 16"
            role="button"
            id="dropdownMenuLink"
            data-bs-toggle="dropdown"
            data-bs-auto-close="outside"
            aria-expanded="false"
          >
            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
          </svg>
        </div>
      </div>
      {status === "loading" && <Loading />}
      {status === "success" && <Constructor />}
      {status === "failed" && (
        <div className="text text-danger m-3">{error}</div>
      )}
    </div>
  );
};

export default App;

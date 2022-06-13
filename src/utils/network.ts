export enum NetworkName {
  Localhost = "Localhost",
  Mainnet = "Mainnet",
  Testnet = "Testnet",
}

export interface SubNetwork {
  url: string;
  name: string;
  reefscanUrl?: string;
  genesisHash?: string;
}

type Networks = {
  [key in NetworkName]: SubNetwork;
};

const networks: Networks = {
  Localhost: {
    name: "Localhost",
    url: "ws://127.0.0.1:9944",
    reefscanUrl: "http://localhost:8000",
  },
  Testnet: {
    name: "Testnet",
    url: "wss://rpc-testnet.reefscan.com/ws",
    reefscanUrl: "https://testnet.reefscan.com",
    genesisHash:
      "0x0f89efd7bf650f2d521afef7456ed98dff138f54b5b7915cc9bce437ab728660",
  },
  Mainnet: {
    name: "Mainnet",
    url: "wss://rpc.reefscan.com/ws",
    reefscanUrl: "https://reefscan.com",
    genesisHash:
      "0x7834781d38e4798d548e34ec947d19deea29df148a7bf32484b7b24dacf8d4b7",
  },
};

export const getNetworkSpec = (name: NetworkName): SubNetwork => ({
  ...networks[name],
});


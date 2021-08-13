export enum NetworkName {
  Localhost="Localhost",
  Mainnet="Mainnet",
  Testnet="Testnet",
}

export interface SubNetwork {
  url: string;
  name: string;
  reefscanUrl?: string;
}

type Networks = {
  [key in NetworkName]: SubNetwork;
};

const networks: Networks = {
  Localhost: {
    name: 'Localhost',
    url: "ws://127.0.0.1:9944",
  },
  Testnet: {
    name: 'Testnet',
    url: "wss://rpc-testnet.reefscan.com/ws",
    reefscanUrl: "https://testnet.reefscan.com",
  },
  Mainnet: {
    name: 'Mainnet',
    url: "wss://rpc.reefscan.com/ws",
    reefscanUrl: "https://reefscan.com",
  }
};

export const getNetworkSpec = (name: NetworkName): SubNetwork => ({...networks[name]});
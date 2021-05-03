import React, { useEffect, useState } from "react"
import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
  web3ListRpcProviders,
  web3UseRpcProvider
} from '@polkadot/extension-dapp';

// returns an array of all the injected sources
// (this needs to be called first, before other requests)
// const allInjected = await web3Enable('my cool dapp');

const App = () => {
  const [text, setText] = useState("");
  
  useEffect(() => {
    web3Enable('reef-remix-plugin')
      .then(() => setText("Dela"))
      .catch(() => setText("Ne dela"))
  }, [])
  return (
    <div>
      Hello World {text}
    </div>
  );
}

export default App;
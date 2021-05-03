import React, { useEffect, useState } from "react"

// import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";

interface ConstructorProps {

}

const Constructor = ({} : ConstructorProps) => {
  const [text, setText] = useState("Loading");

  useEffect(() => {
    // web3Enable("reef-plugin")
    //   .then(() => {
    //     setText("Loaded successfully")
    //   })
    //   .catch((err) => {
    //     setText("Error: " + err.message);
    //   });
  }, [])

  return (
    <div className="m-3">
      hello
      <br/>
      {text}
    </div>
  );
}

export default Constructor;
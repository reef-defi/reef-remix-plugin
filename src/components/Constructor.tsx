import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { isWeb3Injected, web3Accounts, web3Enable } from "@polkadot/extension-dapp";

import { StateType } from "../store/reducers";
import Deploy from "./Deploy";
import DeployedContracts from "./DeployedContracts";
import Copy from "./common/Copy";
import { formatEther } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import { signersSelect } from "../store/actions/signers";
import { findSigner } from "../utils";

interface ConstructorProps { }

const bigNumberToString = (num: BigNumber): string => {
  const value = formatEther(num);
  const point = value.indexOf(".");
  return value.slice(0, point+3);
}

const Constructor = ({} : ConstructorProps) => {
  const dispatch = useDispatch();
  const { signers, index } = useSelector((state: StateType) => state.signers);
  const {contracts} = useSelector((state: StateType) => state.compiledContracts);

  const [selectedContract, setSelectedContract] = useState("");

  const account = index === -1 ? "" : signers[index].address;
  const setAccount = (value: string) => {
    const signerIndex = findSigner(signers, value);
    dispatch(signersSelect(signerIndex));
  };

  useEffect(() => {
    const names = Object.keys(contracts);
    if (names.length > 0) {
      setSelectedContract(names[0]);
    }
  }, [contracts]);

  const signerOptions = signers
    .map(({address, balance}, index) => (
      <option value={address} key={index}>
        {address.slice(0, 6)}
        ...
        {address.slice(address.length-5)} - ({bigNumberToString(balance)} Reef)
      </option>
    ));

  const contractOptions = Object
    .keys(contracts)
    .map((contract, index) => (
      <option value={contract} key={index}>
        {contract}
      </option>
    ));

  return (
    <div className="m-3">
      <div>
        <label>
          Accounts:
        </label>

        <div className="d-flex flex-row align-items-center">
          <select
            id="accountSelector"
            className="form-control select_3rUxUe custom-select flex-fill mr-1"
            value={account}
            onChange={(event) => setAccount(event.target.value)}
          >
            { signerOptions }
          </select>
          <Copy value={account} />
        </div>
      </div>
      <div>
        <label>
          Compiled contracts:
        </label>

        <select
          className="form-control select_3rUxUe custom-select"
          value={selectedContract}
          onChange={(event) => setSelectedContract(event.target.value)}
        >
          { contractOptions }
        </select>
      </div>

      <Deploy contractName={selectedContract} />
      
      <DeployedContracts />
    </div>
  );
}

export default Constructor;
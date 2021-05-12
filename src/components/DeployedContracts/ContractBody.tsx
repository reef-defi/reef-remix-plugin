import React, { useEffect, useState } from "react"
import { Contract } from "ethers";
import { useSelector } from "react-redux";
import { StateType } from "../../store/reducers";
import { CompiledContract, ABIParameter } from "@remixproject/plugin-api/lib/compiler/type";
import { contractAttributeDefaultState, ContractAttributeState, ContractHolder } from "../../state";
import Function from "../common/Function";


interface ContractBodyProps extends ContractHolder { }

const ContractBody = ({name, contract} : ContractBodyProps) => {
  const { contracts } = useSelector((state: StateType) => state.compiledContracts);
  const [state, setState] = useState<ContractAttributeState[]>([]);

  useEffect(() => {
    const abi = contracts[name]!.payload.abi
      .filter((statement) => statement.type !== "constructor")
      .map((desc) => contractAttributeDefaultState(desc));
    setState(abi);
  }, [])

  const attributesView = state
    .map(({text, error, loading, abi}, index) => {
      const parameters = abi.inputs ? abi.inputs as ABIParameter[] : [];

      return (
        <div className="mt-1" key={index}>
          <Function
            text={text}
            error={error}
            name={abi.name ? abi.name : ""}
            parameters={parameters}
            submitCollapse={async (values) => {}}
            submitInline={async (value) => {}}
          />
        </div>
      )
    });

  return (
    <div>
      {attributesView}
    </div>
  );
}

export default ContractBody;
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { StateType } from "../../store/reducers";
import { ABIParameter } from "@remixproject/plugin-api/lib/compiler/type";
import { contractAttributeDefaultState, ContractAttributeState, ContractHolder } from "../../state";
import Function from "../common/Function";
import { contractParameters, getParameters } from "../../utils";


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

  const updateState = (field: ContractAttributeState, index: number) =>
    setState([
      ...state.slice(0, index),
      field,
      ...state.slice(index+1),
    ]);

  const submitCollapse = (index: number) => async (values: string[]) => {
    const field = state[index]
    const name = field.abi.name!;
    try {
      const result = await contract[name](...values);
      updateState({...field, text: await result.toString(), error: false}, index);
    } catch (e) {
      console.error(e);
      updateState({...field, text: e.message, error: true}, index);
    }
  };
  const submitInline = (index: number) => async (value: string) => {
    const field = state[index];
    const name = field.abi.name!;
    const parameters = contractParameters(value);
    try {
      const result = await contract[name](...parameters);
      const text = await result.toString();
      updateState({...field, text, error: false}, index);
    } catch (e) {
      console.error(e);
      updateState({...field, text: e.message, error: true}, index);
    }
  };

  const attributesView = state
    .map(({text, error, loading, abi}, index) => {
      const parameters = abi.inputs ? abi.inputs as ABIParameter[] : [];

      return (
        <div className="mt-1" key={index}>
          <Function
            text={text}
            error={error}
            parameters={parameters}
            name={abi.name ? abi.name : ""}
            submitInline={submitInline(index)}
            submitCollapse={submitCollapse(index)}
          />
        </div>
      )
    });

  return (
    <>
      {attributesView}
    </>
  );
}

export default ContractBody;
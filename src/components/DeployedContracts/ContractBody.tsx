import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { StateType } from "../../store/reducers";
import { ABIParameter, FunctionDescription } from "@remixproject/plugin-api/lib/compiler/type";
import { contractAttributeDefaultState, ContractAttributeState, ContractHolder } from "../../state";
import Function from "../Function/Function";
import { prepareParameters } from "../../utils";
import { RightSmallLoading } from "../common/loading/Loading";


interface ContractBodyProps extends ContractHolder { }

const isLoadingError = (field: ContractAttributeState): ContractAttributeState => ({...field,
  text: "One function is already running. Please wait a bit!",
  error: true
});

const ContractBody = ({name, contract} : ContractBodyProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<ContractAttributeState[]>([]);
  const { contracts } = useSelector((state: StateType) => state.compiledContracts);

  useEffect(() => {
    const abi = contracts[name]!.payload.abi
      .filter((statement) => statement.type === "function")
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
    if (isLoading) {
      updateState(isLoadingError(field), index);
      return;
    }

    try {
      setIsLoading(true);
      const result = await contract[field.abi.name!](...values);
      updateState({...field, text: await result.toString(), error: false}, index);
    } catch (e) {
      console.error(e);
      const message = typeof e === "string" ? e : e.message;
      updateState({...field, text: message, error: true}, index);
    } finally {
      setIsLoading(false);
    }
  };
  const submitInline = (index: number) => async (value: string) => {
    const field = state[index];
    if (isLoading) {
      updateState(isLoadingError(field), index);
      return;
    }

    try {
      const parameters = prepareParameters(value);
      setIsLoading(true);
      const result = await contract[field.abi.name!](...parameters);
      // effect allows filters only functions so we can cast them in FunctionDescription
      const abi = state[index].abi as FunctionDescription;
      const text = abi.outputs && abi.outputs.length !== 0 ? await result.toString() : "Success";
      updateState({...field, text, error: false}, index);
    } catch (e) {
      console.error(e);
      const message = typeof e === "string" ? e : e.message;
      updateState({...field, text: message, error: true}, index);
    } finally {
      setIsLoading(false);
    }
  };

  const attributesView = state
    .map(({text, error, abi}, index) => {
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
      { isLoading && <RightSmallLoading /> }
    </>
  );
}

export default ContractBody;
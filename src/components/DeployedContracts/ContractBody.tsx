import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "../../store/reducers";
import { ABIParameter, FunctionDescription } from "@remixproject/plugin-api/lib/compiler/type";
import { contractAttributeDefaultState, ContractAttributeState, ContractHolder } from "../../state";
import Function from "../Function/Function";
import { prepareParameters } from "../../utils";
import { signersBalance } from "../../store/actions/signers";


interface ContractBodyProps extends ContractHolder {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
 }

const isLoadingError = (field: ContractAttributeState): ContractAttributeState => ({...field,
  text: "One function is already running. Please wait a bit!",
  error: true
});

const ContractBody = ({name, contract, isLoading, setIsLoading} : ContractBodyProps) => {
  const dispatch = useDispatch();

  const [state, setState] = useState<ContractAttributeState[]>([]);

  const signers = useSelector((state: StateType) => state.signers);
  const { provider } = useSelector((state: StateType) => state.utils);
  const { contracts } = useSelector((state: StateType) => state.compiledContracts);

  useEffect(() => {
    const abi = contracts[name]!.payload.abi
      .filter((statement) => statement.type === "function")
      .map((statement) => statement as FunctionDescription)
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
      const text = abi.outputs && abi.outputs.length !== 0 ? await result.toString() : "";
      updateState({...field, text, error: false}, index);
    } catch (e) {
      console.error(e);
      const message = typeof e === "string" ? e : e.message;
      updateState({...field, text: message, error: true}, index);
    } finally {
      setIsLoading(false);
      const balance = await provider!.getBalance(
        signers.signers[signers.index].address);
      dispatch(signersBalance(balance));
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
            isReturn={abi.outputs!.length !== 0}
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
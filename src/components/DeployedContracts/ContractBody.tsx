import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "../../store/reducers";
import { ABIParameter, FunctionDescription } from "@remixproject/plugin-api/lib/compiler/type";
import { contractAttributeDefaultState, ContractAttributeState, ContractHolder } from "../../store/localState";
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

const extractResult = async (result: any, outputs?: ABIParameter[]): Promise<string> => {
  if (!outputs || outputs.length === 0) { 
    return Promise.resolve("");
  }
  return await result.toString();
}

const ContractBody = ({name, contract, isLoading, setIsLoading} : ContractBodyProps) => {
  const dispatch = useDispatch();

  const [state, setState] = useState<ContractAttributeState[]>([]);

  const signers = useSelector((state: StateType) => state.signers);
  const { provider, notify } = useSelector((state: StateType) => state.utils);
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
      const text = await extractResult(result, state[index].abi.outputs);
      notify(`${field.abi.name} call success!`);
      notify(
        `${field.abi.name} call with parameters: ${values.join(", ")} complete!
        <br>Result: ${text}`
      );
      updateState({...field, text, error: false}, index);
    } catch (e) {
      const message = typeof e === "string" ? e : e.message;
      notify(`There was an error in ${field.abi.name} call. Error: ${message}`, "error");
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
      const text = await extractResult(result, state[index].abi.outputs);
      notify(
        `${field.abi.name} call with parameters: ${value} complete!
        <br>Result: ${text}`
      );
      updateState({...field, text, error: false}, index);
    } catch (e) {
      const message = typeof e === "string" ? e : e.message;
      notify(`There was an error in ${field.abi.name} call. Error: ${message}`, "error");
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
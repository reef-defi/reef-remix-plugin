import { useDispatch, useSelector } from "react-redux";
import { getSigner, submitDeploy } from "../../api/contract";
import { StateType } from "../../store/reducers";
import { getConstructor } from "../../utils";
import { CompiledContract, ABIParameter } from "@remixproject/plugin-api/lib/compiler/type";
import CollapsedFunction from "../common/CollapsedFunction";

interface ControlledDeployProps {
  signerAddress: string;
  contract: CompiledContract;
  onClose: () => void;
}

const CollapsedDeploy = ({contract, signerAddress, onClose}: ControlledDeployProps) => {
  const dispatch = useDispatch();
  const {signers} = useSelector((state: StateType) => state.signers);
  const { errorMessage } = useSelector((state: StateType) => state.contracts);

  const abi = getConstructor(contract.abi)!;
  const signer = getSigner(signers, signerAddress);
  const parameters = abi.inputs! as ABIParameter[];

  const submit = async (values: string[]) => {
    await submitDeploy(values, contract, signer.signer, dispatch);
  };

  return (
    <CollapsedFunction
      parameters={parameters}
      errorMessage={errorMessage}
      onClose={onClose}
      submit={submit}
    />
  )
}

export default CollapsedDeploy;
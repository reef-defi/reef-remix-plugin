import { RemixSigner } from "../../state/signers";
import { SignersActionType } from "../actions/signers";
import { SIGNERS_LOAD } from "../actionType";


export interface SignersReducer {
  signers: RemixSigner[];
}

const initialState: SignersReducer = {
  signers: []
};

export const signersReducer = (state=initialState, action: SignersActionType): SignersReducer => {
  switch (action.type) {
    case SIGNERS_LOAD:
      return {...state, signers: action.signers};
    default: return state;
  }
}
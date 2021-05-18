import { RemixSigner } from "../../state/signers";
import { SignersActionType } from "../actions/signers";
import { SIGNERS_BALANCE, SIGNERS_LOAD } from "../actionType";


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
    case SIGNERS_BALANCE:
      return {...state, signers: [
        ...state.signers.slice(0, action.index),
        {
          ...state.signers[action.index],
          balance: action.balance
        },
        ...state.signers.slice(action.index+1)
      ]}
    default: return state;
  }
}
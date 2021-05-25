import { SignersActionType } from "../actions/signers";
import { SIGNERS_BALANCE, SIGNERS_LOAD, SIGNERS_SELECT } from "../actionType";
import { RemixSigner } from "../localState";


export interface SignersReducer {
  index: number;
  signers: RemixSigner[];
}

const initialState: SignersReducer = {
  index: -1,
  signers: []
};

export const signersReducer = (state=initialState, action: SignersActionType): SignersReducer => {
  switch (action.type) {
    case SIGNERS_LOAD:
      return {...state, signers: action.signers};
    case SIGNERS_SELECT:
      return {...state, index: action.index};
    case SIGNERS_BALANCE:
      return {...state, signers: [
        ...state.signers.slice(0, state.index),
        {
          ...state.signers[state.index],
          balance: action.balance
        },
        ...state.signers.slice(state.index+1)
      ]}
    default: return state;
  }
}
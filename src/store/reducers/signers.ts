import { SignersActionType } from "../actions/signers";
import { SIGNERS_BALANCE, SIGNERS_ADD, SIGNERS_SELECT, SIGNERS_CLEAR, SIGNERS_ADD_LIST } from "../actionType";
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
    case SIGNERS_ADD:
      return {...state, signers: [...state.signers, action.signer], index: state.signers.length};
    case SIGNERS_ADD_LIST:
      return {...state, signers: [...action.signers], index: action.signers.length > 0 ? 0 : -1};
    case SIGNERS_SELECT:
      return {...state, index: action.index};
    case SIGNERS_CLEAR:
      return {...state, signers: [], index: -1};
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
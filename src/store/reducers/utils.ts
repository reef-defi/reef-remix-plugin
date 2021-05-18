import { UtilsActionType } from "../actions/utils";
import { UTILS_SET_NOTIFY, UTILS_SET_PROVIDER } from "../actionType";
import { Provider } from '@reef-defi/evm-provider';

export interface UtilsReducer {
  notify: (message: string) => void;
  provider: Provider | undefined;
}

const initialUtilsState: UtilsReducer = {
  notify: (message: string) => {},
  provider: undefined,
}

export const utilsReducer = (state=initialUtilsState, action: UtilsActionType): UtilsReducer => {
  switch (action.type) {
    case UTILS_SET_NOTIFY: return {...state, notify: action.function};
    case UTILS_SET_PROVIDER: return {...state, provider: action.provider};
    default: return state;
  }
} 
import { UtilsActionType } from "../actions/utils";
import { UTILS_SET_NOTIFY } from "../actionType";

export interface UtilsReducer {
  notify: (message: string) => void;
}

const initialUtilsState: UtilsReducer = {
  notify: (message: string) => {},
}

export const utilsReducer = (state=initialUtilsState, action: UtilsActionType): UtilsReducer => {
  switch (action.type) {
    case UTILS_SET_NOTIFY: return {...state, notify: action.function};
    default: return state;
  }
} 
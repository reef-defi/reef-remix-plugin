import { UTILS_SET_NOTIFY } from "../actionType";

export type NotifyFun = (message: string) => void;

interface SetNotifyAction {
  type: typeof UTILS_SET_NOTIFY;
  function: NotifyFun;
}

export type UtilsActionType = 
  | SetNotifyAction;

export const setNotifyAction = (fun: NotifyFun): SetNotifyAction => ({
  type: UTILS_SET_NOTIFY,
  function: fun
});
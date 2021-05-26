import { UTILS_SET_NOTIFY, UTILS_SET_PROVIDER } from "../actionType";
import { Provider } from '@reef-defi/evm-provider';

export type NotifyFun = (message: string) => void;

interface SetNotifyAction {
  type: typeof UTILS_SET_NOTIFY;
  function: NotifyFun;
}

interface SetProviderAction {
  type: typeof UTILS_SET_PROVIDER;
  provider?: Provider;
}

export type UtilsActionType = 
  | SetNotifyAction
  | SetProviderAction;

export const setNotifyAction = (fun: NotifyFun): SetNotifyAction => ({
  type: UTILS_SET_NOTIFY,
  function: fun
});

export const setProviderAction = (provider?: Provider): SetProviderAction => ({
  type: UTILS_SET_PROVIDER,
  provider
});
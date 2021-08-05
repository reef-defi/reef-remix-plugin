import { UTILS_SET_NOTIFY, UTILS_SET_PROVIDER, UTILS_SET_VERIFICATION_URL } from "../actionType";
import { Provider } from '@reef-defi/evm-provider';

export type NotificationType = "success" | "error" | "warning";
export type NotifyFun = (message: string, type?: NotificationType) => void;

interface SetNotifyAction {
  type: typeof UTILS_SET_NOTIFY;
  function: NotifyFun;
}

interface SetProviderAction {
  type: typeof UTILS_SET_PROVIDER;
  provider?: Provider;
}

interface SetVerificationAction {
  type: typeof UTILS_SET_VERIFICATION_URL;
  url?: string;
}

export type UtilsActionType = 
  | SetNotifyAction
  | SetVerificationAction
  | SetProviderAction;

export const setVerificationUrl = (url?: string): SetVerificationAction => ({
  type: UTILS_SET_VERIFICATION_URL,
  url
});

export const setNotifyAction = (fun: NotifyFun): SetNotifyAction => ({
  type: UTILS_SET_NOTIFY,
  function: fun
});

export const setProviderAction = (provider?: Provider): SetProviderAction => ({
  type: UTILS_SET_PROVIDER,
  provider
});
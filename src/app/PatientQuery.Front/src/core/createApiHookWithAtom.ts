import { useCallback } from 'react';
import { ApiCallResult } from 'react-apiloader';

import { ClientError, createApiHook, IAxiosClient } from './loader';

export const createApiHookWithAtom = <TState, TParams>(
  promiseFactory: (http: IAxiosClient, params: TParams) => Promise<TState>,
  stateHook: () => readonly [TState, React.Dispatch<React.SetStateAction<TState>>]
) => {
  const apiHook = createApiHook(promiseFactory);
  const useApi = (): [
    Readonly<TState>,
    (params: TParams) => Promise<ApiCallResult<TState, ClientError>>,
    React.Dispatch<React.SetStateAction<TState>>
  ] => {
    // state
    const [state, setState] = stateHook();
    // api
    const actionApi = apiHook();
    // create main callback
    const doApiCall = useCallback(
      (params: TParams) => {
        return actionApi(params).then((apiCallResult) => {
          if (apiCallResult.isSuccess) setState(apiCallResult.data);
          return apiCallResult;
        });
      },
      [actionApi, setState]
    );
    return [state, doApiCall, setState];
  };
  useApi.id = apiHook.id;
  return useApi;
};

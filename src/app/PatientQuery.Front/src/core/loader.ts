import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { stringify } from 'query-string';
import { ClientAdapter, ClientFactory, createLoaderApi } from 'react-apiloader';

import { alertAtom, createAlerts } from '@/base/alerts';
import { authInfoAtom } from '@/global/useAuth';
import { DateTime } from '@/utils/dateTime';
import { saveFile } from '@/utils/file';

import { GlobalState } from './globalState';

export type ClientError = {
  description: string | string[];
  status?: number;
  data?: unknown;
};

export interface IAxiosClient {
  get<T, D = unknown>(url: string, params?: Record<string, unknown>, settings?: AxiosRequestConfig<D>): Promise<T>;
  getFile(url: string, params?: Record<string, unknown>): Promise<void>;
  post<T, D = unknown>(
    url: string,
    data?: D,
    params?: Record<string, unknown>,
    settings?: AxiosRequestConfig<D>
  ): Promise<T>;
  postForm<T, D = unknown>(
    url: string,
    data?: D,
    params?: Record<string, unknown>,
    settings?: AxiosRequestConfig<D>
  ): Promise<T>;
  delete<T, D = unknown>(url: string, params?: Record<string, unknown>, settings?: AxiosRequestConfig<D>): Promise<T>;
}

export const { createApiHook, createApiHookWithState, LoaderContextProvider, useLoaderInfo } = createLoaderApi<
  IAxiosClient,
  ClientError
>();

export const createAxiosClientFactory = (
  baseUrl: string,
  state: GlobalState
): ClientFactory<IAxiosClient, ClientError> => () => {
  const source = axios.CancelToken.source();
  const token = state.tryGet(authInfoAtom)?.value()?.token;
  const auth = token != null ? { Authorization: 'Bearer ' + token } : {};
  const appVersion = window?.appSettings?.appVersion;

  const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json',
      appVersion,
      ...auth,
    },
    cancelToken: source.token,
    paramsSerializer: {
      serialize: (params: Record<string, unknown>) => stringify(params, { arrayFormat: 'index' }),
    },
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        state.tryGet(authInfoAtom)?.setValue(undefined);
      }
      return Promise.reject(error);
    }
  );

  const client: IAxiosClient = {
    get: <T, D = unknown>(url: string, params?: Record<string, unknown>, settings?: AxiosRequestConfig<D>) =>
      axiosInstance
        .get<T, AxiosResponse<T>, D>(url, { params, ...settings })
        .then((x) => x.data),
    getFile: (url, params) =>
      axiosInstance
        .get<Blob>(url, { params, responseType: 'blob' })
        .then((x) => {
          const contentDisposition = x.headers['content-disposition'] as string;
          const filename = /filename=([^;]+)/.exec(contentDisposition)?.[1] ?? '';
          saveFile(x.data, filename);
          return;
        }),
    post: <T, D = unknown>(url: string, data?: D, params?: Record<string, unknown>, settings?: AxiosRequestConfig<D>) =>
      axiosInstance.post(url, data, { params, ...settings }).then((x) => x.data as T),
    postForm: <T, D = unknown>(
      url: string,
      data?: D,
      params?: Record<string, unknown>,
      settings?: AxiosRequestConfig<D>
    ) =>
      axiosInstance
        .postForm(url, data, { params, ...settings, formSerializer: { indexes: null } })
        .then((x) => x.data as T),
    delete: <T, D = unknown>(url: string, params?: Record<string, unknown>, settings?: AxiosRequestConfig<D>) =>
      axiosInstance
        .delete<T, AxiosResponse<T>, D>(url, { params, ...settings })
        .then((x) => x.data),
  };

  const adapter: ClientAdapter<ClientError> = {
    cancel: () => source.cancel(),
    isCanceled: (error: unknown) => axios.isCancel(error),
    parseError: (error: unknown) => {
      console.error('# ERROR #', error);
      let parsed: ClientError;
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as {
          isError: boolean;
          message: string;
          title: string;
        };
        parsed = {
          description: data?.isError ? data.message : data?.title ?? error.message,
          data,
          status: error.response?.status,
        };
      } else
        parsed = {
          description: (error as Error)?.message ?? 'Unknown error: ' + DateTime.format(new Date(), 'datetime'),
        };
      state.tryGet(alertAtom)?.setValue((x) => x.concat(createAlerts(parsed.description)));
      return parsed;
    },
  };

  return [client, adapter];
};

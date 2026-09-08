import axios, { AxiosError, AxiosInstance } from 'axios';
import { useAuthStore } from '@/store/auth.store';

type SignOut = () => void;
type ApiInstance = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void;
};

type FailedRequest = {
  onSuccess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
};

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL!,
}) as ApiInstance;

export const apiGoLeads = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_GOLEADS_URL!,
});

api.interceptors.request.use(async (config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (__DEV__) {
    console.tron?.log?.(`[REQUEST] ${config.method?.toUpperCase()} ${config.url}`);
  }

  return config;
});

const extractErrorMessage = (data: unknown) => {
  if (typeof data === 'string') return data;
  const errorData = data as any;
  return (
    errorData?.detail ??
    errorData?.message ??
    errorData?.errors?.[0]?.message ??
    errorData?.error ??
    'Erro desconhecido'
  );
};

api.registerInterceptTokenManager = (signOut) => {
  const interceptor = api.interceptors.response.use(
    (response) => response,
    async (requestError: AxiosError) => {
      const status = requestError.response?.status;

      if (status !== 401 && status !== 403) {
        if (requestError.response?.data) {
          return Promise.reject(new Error(extractErrorMessage(requestError.response.data)));
        }
        return Promise.reject(requestError);
      }

      const { refreshToken } = useAuthStore.getState();
      if (!refreshToken) {
        signOut();
        return Promise.reject(requestError);
      }

      const originalRequestConfig = requestError.config!;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            onSuccess: (token) => {
              originalRequestConfig.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequestConfig));
            },
            onFailure: (error) => reject(error),
          });
        });
      }

      isRefreshing = true;

      return new Promise((resolve, reject) => {
        axios
          .post(`${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`, { refreshToken })
          .then(async ({ data }) => {
            await useAuthStore.getState().setTokens(data.token, data.refresh);

            originalRequestConfig.headers.Authorization = `Bearer ${data.token}`;
            failedQueue.forEach((request) => request.onSuccess(data.token));
            resolve(api(originalRequestConfig));
          })
          .catch((error: AxiosError) => {
            failedQueue.forEach((request) => request.onFailure(error));
            signOut();
            reject(error);
          })
          .finally(() => {
            isRefreshing = false;
            failedQueue = [];
          });
      });
    },
  );

  return () => api.interceptors.response.eject(interceptor);
};

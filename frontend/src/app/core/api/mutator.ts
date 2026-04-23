import axios, { AxiosRequestConfig } from 'axios';
import { environment } from '../../../environments/environment';

export const AXIOS_INSTANCE = axios.create({
  baseURL: environment.apiUrl,
});

AXIOS_INSTANCE.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  return AXIOS_INSTANCE(config).then(({ data }) => data);
};

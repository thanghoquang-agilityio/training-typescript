import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

// Service time out 5 minutes
const TIMEOUT = 5 * 60 * 1000;

const instance: AxiosInstance = axios.create({
  baseURL: process.env.API_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.response.use(
  <T>(value: AxiosResponse<T>): Promise<T> => Promise.resolve(value?.data),
  <T>(error: AxiosError<T>): Promise<T> => Promise.reject(error?.response?.data),
);

export default instance;

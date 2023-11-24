import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

// Service time out 5 minutes
const timeout = 5 * 60 * 1000;

const instance: AxiosInstance = axios.create({
  baseURL: process.env.API_URL,
  timeout: timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.response.use(
  <T>(value: AxiosResponse<T>): AxiosResponse<T> => {
    return value;
  },
  <T>(error: AxiosError<T>): Promise<{ statusCode: number; data: T }> => {
    return Promise.reject({
      statusCode: error.status,
      data: error?.response?.data,
    });
  },
);

export default instance;

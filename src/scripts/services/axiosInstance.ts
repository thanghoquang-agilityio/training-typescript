import axios, { AxiosInstance } from 'axios';
import { SERVICE_TIMEOUT } from '@/constants/api';

const instance: AxiosInstance = axios.create({
  baseURL: process.env.API_URL,
  timeout: SERVICE_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;

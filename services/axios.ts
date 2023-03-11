import buildUrl from '@/lib/buildUrl';
import { AxiosRequestConfig, AxiosResponse, default as axios } from 'axios';

export interface APIResponse {
  ok: boolean;
};

export interface APIErrorResponse extends APIResponse {
  error?: string;
  details?: {
    [key: string]: any;
  };
};

class AxiosService {
  public async get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    const requestUrl: string = buildUrl(url);
    return axios.get(requestUrl, config);
  }

  public async post<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    const requestUrl: string = buildUrl(url);
    return axios.post(requestUrl, data, config);
  }

  public async put<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    const requestUrl: string = buildUrl(url);
    return axios.put(requestUrl, data, config);
  }

  public async patch<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    const requestUrl: string = buildUrl(url);
    return axios.patch(requestUrl, data, config);
  }

  public async delete<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    const requestUrl: string = buildUrl(url);
    return axios.delete(requestUrl, config);
  }
}

const axiosService = new AxiosService();
export default axiosService;

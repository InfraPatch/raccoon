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
  static DEFAULT_CONFIG: AxiosRequestConfig = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };

  private makeConfig(config: AxiosRequestConfig): AxiosRequestConfig {
    return {
      ...AxiosService.DEFAULT_CONFIG,
      ...config
    };
  }

  public async get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    const requestUrl: string = buildUrl(url);
    const finalConfig: AxiosRequestConfig = this.makeConfig(config);
    return axios.get(requestUrl, finalConfig);
  }

  public async post<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    const requestUrl: string = buildUrl(url);
    const finalConfig: AxiosRequestConfig = this.makeConfig(config);
    return axios.post(requestUrl, data, finalConfig);
  }

  public async put<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    const requestUrl: string = buildUrl(url);
    const finalConfig: AxiosRequestConfig = this.makeConfig(config);
    return axios.put(requestUrl, data, finalConfig);
  }

  public async patch<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    const requestUrl: string = buildUrl(url);
    const finalConfig: AxiosRequestConfig = this.makeConfig(config);
    return axios.patch(requestUrl, data, finalConfig);
  }

  public async delete<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    const requestUrl: string = buildUrl(url);
    const finalConfig: AxiosRequestConfig = this.makeConfig(config);
    return axios.delete(requestUrl, finalConfig);
  }
}

const axiosService = new AxiosService();
export default axiosService;

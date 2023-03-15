import axiosService from '@/services/axios';
import { APIResponse } from '@/services/axios';

import { ContractOption, ContractOptionType } from '@/db/models/contracts/ContractOption';

export interface ContractOptionAPIType {
  type: ContractOptionType;
  priority: number;
  friendlyName: string;
  longDescription?: string;
  hint?: string;
  replacementString: string;
  minimumValue?: number;
  maximumValue?: number;
  isSeller?: boolean;
};

export interface ContractIdAPIRequest {
  id: number;
}

export interface NewContractOptionAPIRequest extends ContractOptionAPIType {
  contractId: number;
};
export interface NewContractOptionAPIResponse extends APIResponse {
  option: ContractOption;
};

export interface GetContractOptionsAPIRequest extends ContractIdAPIRequest {};
export interface GetContractOptionAPIRequest extends ContractIdAPIRequest {};

export interface GetContractOptionsAPIResponse extends APIResponse {
  options: ContractOption[];
};
export interface GetContractOptionAPIResponse extends APIResponse {
  option: ContractOption;
};

export interface DeleteContractOptionAPIRequest extends ContractIdAPIRequest {};
export interface UpdateContractOptionAPIRequest extends NewContractOptionAPIRequest, ContractIdAPIRequest {};
export interface UpdateContractOptionAPIResponse extends APIResponse {};
export interface DeleteContractOptionAPIResponse extends APIResponse {};

class ContractOptionsAPIService {
  static CONTRACT_OPTIONS_URL = '/api/contract-options';
  headers = null;

  public setHeaders(headers) {
    this.headers = headers;
  }

  public async newContractOption(data: NewContractOptionAPIRequest): Promise<NewContractOptionAPIResponse> {
    return axiosService.post(ContractOptionsAPIService.CONTRACT_OPTIONS_URL, data, { headers: this.headers })
      .then(res => res.data);
  }

  public async updateContractOption(data: UpdateContractOptionAPIRequest): Promise<UpdateContractOptionAPIResponse> {
    const { id } = data;

    return axiosService.patch(`${ContractOptionsAPIService.CONTRACT_OPTIONS_URL}/${id}`, data, { headers: this.headers })
      .then(res => res.data);
  }

  public async getContractOptions(data: GetContractOptionsAPIRequest) : Promise<GetContractOptionsAPIResponse> {
    return axiosService.get(ContractOptionsAPIService.CONTRACT_OPTIONS_URL, { headers: this.headers })
      .then(res => res.data);
  }

  public async getContractOption({ id }: GetContractOptionAPIRequest) : Promise<GetContractOptionAPIResponse> {
    return axiosService.get(`${ContractOptionsAPIService.CONTRACT_OPTIONS_URL}/${id}`, { headers: this.headers })
      .then(res => res.data);
  }

  public async deleteContractOption({ id }: DeleteContractOptionAPIRequest) : Promise<DeleteContractOptionAPIResponse> {
    return axiosService.delete(`${ContractOptionsAPIService.CONTRACT_OPTIONS_URL}/${id}`, { headers: this.headers })
      .then(res => res.data);
  }
}

export {
  ContractOptionsAPIService
};

import axiosService from '@/services/axios';
import { APIResponse } from '@/services/axios';

import { ContractOption } from '@/db/models/contracts/ContractOption';
import { OptionType } from '@/db/common/OptionType';

export interface ContractOptionAPIType {
  type: OptionType;
  priority: number;
  friendlyName: string;
  longDescription?: string;
  hint?: string;
  replacementString: string;
  minimumValue?: number;
  maximumValue?: number;
  isSeller?: boolean;
}

export interface ContractIdAPIRequest {
  id: number;
}

export interface NewContractOptionAPIRequest extends ContractOptionAPIType {
  contractId: number;
}
export interface NewContractOptionAPIResponse extends APIResponse {
  option: ContractOption;
}

export type GetContractOptionsAPIRequest = ContractIdAPIRequest;
export type GetContractOptionAPIRequest = ContractIdAPIRequest;

export interface GetContractOptionsAPIResponse extends APIResponse {
  options: ContractOption[];
}
export interface GetContractOptionAPIResponse extends APIResponse {
  option: ContractOption;
}

export type DeleteContractOptionAPIRequest = ContractIdAPIRequest;
export interface UpdateContractOptionAPIRequest
  extends NewContractOptionAPIRequest,
    ContractIdAPIRequest {}
export type UpdateContractOptionAPIResponse = APIResponse;
export type DeleteContractOptionAPIResponse = APIResponse;

class ContractOptionsAPIService {
  static CONTRACT_OPTIONS_URL = '/api/contract-options';

  public async newContractOption(
    data: NewContractOptionAPIRequest,
  ): Promise<NewContractOptionAPIResponse> {
    return axiosService
      .post(ContractOptionsAPIService.CONTRACT_OPTIONS_URL, data)
      .then((res) => res.data);
  }

  public async updateContractOption(
    data: UpdateContractOptionAPIRequest,
  ): Promise<UpdateContractOptionAPIResponse> {
    const { id } = data;

    return axiosService
      .patch(`${ContractOptionsAPIService.CONTRACT_OPTIONS_URL}/${id}`, data)
      .then((res) => res.data);
  }

  public async getContractOptions(
    data: GetContractOptionsAPIRequest,
  ): Promise<GetContractOptionsAPIResponse> {
    return axiosService
      .get(ContractOptionsAPIService.CONTRACT_OPTIONS_URL)
      .then((res) => res.data);
  }

  public async getContractOption({
    id,
  }: GetContractOptionAPIRequest): Promise<GetContractOptionAPIResponse> {
    return axiosService
      .get(`${ContractOptionsAPIService.CONTRACT_OPTIONS_URL}/${id}`)
      .then((res) => res.data);
  }

  public async deleteContractOption({
    id,
  }: DeleteContractOptionAPIRequest): Promise<DeleteContractOptionAPIResponse> {
    return axiosService
      .delete(`${ContractOptionsAPIService.CONTRACT_OPTIONS_URL}/${id}`)
      .then((res) => res.data);
  }
}

export { ContractOptionsAPIService };

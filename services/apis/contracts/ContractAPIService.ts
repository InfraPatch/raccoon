import axiosService from '@/services/axios';
import { APIResponse } from '@/services/axios';

import { Contract } from '@/db/models/contracts/Contract';

export interface NewContractAPIRequest {
  friendlyName: string;
  description: string;
  itemSlug?: string;
  file: File;
}

export interface ContractIdAPIRequest {
  id: number;
}

export type GetContractAPIRequest = ContractIdAPIRequest;
export interface GetContractAPIResponse extends APIResponse {
  contract: Contract;
}
export type DeleteContractAPIRequest = ContractIdAPIRequest;
export interface UpdateContractAPIRequest
  extends NewContractAPIRequest,
    ContractIdAPIRequest {}
export interface UpdateContractAPIResponse
  extends APIResponse,
    GetContractAPIResponse {}
export type DeleteContractAPIResponse = APIResponse;
export interface NewContractAPIResponse
  extends APIResponse,
    GetContractAPIResponse {}

export interface GetContractsAPIResponse extends APIResponse {
  contracts: Contract[];
}

class ContractsAPIService {
  static CONTRACT_URL = '/api/contracts';

  private createContractData(data: NewContractAPIRequest): FormData {
    const payload = new FormData();

    if (data.friendlyName) {
      payload.append('friendlyName', data.friendlyName);
    }

    if (data.description) {
      payload.append('description', data.description);
    }

    if (data.itemSlug?.length) {
      payload.append('itemSlug', data.itemSlug);
    }

    if (data.file) {
      payload.append('file', data.file);
    }

    return payload;
  }

  public async newContract(
    data: NewContractAPIRequest,
  ): Promise<NewContractAPIResponse> {
    const payload = this.createContractData(data);

    return axiosService
      .post(ContractsAPIService.CONTRACT_URL, payload)
      .then((res) => res.data);
  }

  public async updateContract(
    data: UpdateContractAPIRequest,
  ): Promise<UpdateContractAPIResponse> {
    const { id } = data;
    const payload = this.createContractData(data);

    return axiosService
      .patch(`${ContractsAPIService.CONTRACT_URL}/${id}`, payload)
      .then((res) => res.data);
  }

  public async getContracts(): Promise<GetContractsAPIResponse> {
    return axiosService
      .get(ContractsAPIService.CONTRACT_URL)
      .then((res) => res.data);
  }

  public async getContract({
    id,
  }: GetContractAPIRequest): Promise<GetContractAPIResponse> {
    return axiosService
      .get(`${ContractsAPIService.CONTRACT_URL}/${id}`)
      .then((res) => res.data);
  }

  public async deleteContract({
    id,
  }: DeleteContractAPIRequest): Promise<DeleteContractAPIResponse> {
    return axiosService
      .delete(`${ContractsAPIService.CONTRACT_URL}/${id}`)
      .then((res) => res.data);
  }
}

export { ContractsAPIService };

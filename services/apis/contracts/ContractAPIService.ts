import axiosService from '@/services/axios';
import { APIResponse } from '@/services/axios';

import { Contract } from '@/db/models/contracts/Contract';
import { ContractFile } from '@/db/models/contracts/ContractFile';
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
};

export interface CreateNewContractAPIRequest {
  friendlyName: string;
  description: string;
};

class ContractAPIService {
  static NEW_CONTRACT_URL = '/api/users/new-contract';

  public async newContract(data: CreateNewContractAPIRequest): Promise<Contract> {
    return axiosService.post(ContractAPIService.NEW_CONTRACT_URL, data)
      .then(res => res.data);
  }
}

export {
  ContractAPIService
};

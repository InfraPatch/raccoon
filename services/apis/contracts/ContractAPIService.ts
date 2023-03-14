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

export interface NewContractAPIRequest {
  friendlyName: string;
  description: string;
  file: File;
};

class ContractsAPIService {
  static NEW_CONTRACT_URL = '/api/contracts';

  public async newContract(data: NewContractAPIRequest): Promise<Contract> {
    const payload = new FormData();

    if (data.friendlyName) {
      payload.append('friendlyName', data.friendlyName);
    }

    if (data.description) {
      payload.append('description', data.description);
    }

    if (data.file) {
      payload.append('file', data.file);
    }

    return axiosService.post(ContractsAPIService.NEW_CONTRACT_URL, payload)
      .then(res => res.data);
  }
}

export {
  ContractsAPIService
};

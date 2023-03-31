import axiosService, { APIResponse } from '@/services/axios';
import { IWitnessSignature } from '@/db/models/contracts/WitnessSignature';

export interface NewWitnessSignatureAPIParams {
  witnessEmail: string;
  filledContractId: number;
};

export interface GetWitnessSignatureAPIResponse extends APIResponse {
  witnessSignature: IWitnessSignature;
};

export interface CreateWitnessSignatureAPIResponse extends GetWitnessSignatureAPIResponse {};
export interface DeleteWitnessSignatureAPIResponse extends APIResponse {};

const url = (template: string, id: number) => template.replace(':id', id.toString());

export class WitnessSignatureAPIService {
  static CREATE_WITNESS_SIGNATURE_URL = '/api/witness-signatures';
  static GET_WITNESS_SIGNATURE_URL = '/api/witness-signatures/:id';
  static DELETE_WITNESS_SIGNATURE_URL = '/api/witness-signatures/:id';

  public async createWitnessSignature(payload: NewWitnessSignatureAPIParams): Promise<CreateWitnessSignatureAPIResponse> {
    return axiosService.post(WitnessSignatureAPIService.CREATE_WITNESS_SIGNATURE_URL, payload)
      .then(res => res.data);
  }

  public async getWitnessSignature(id: number): Promise<GetWitnessSignatureAPIResponse> {
    return axiosService.get(url(WitnessSignatureAPIService.GET_WITNESS_SIGNATURE_URL, id))
      .then(res => res.data);
  }

  public async deleteWitnessSignature(id: number): Promise<DeleteWitnessSignatureAPIResponse> {
    return axiosService.delete(url(WitnessSignatureAPIService.DELETE_WITNESS_SIGNATURE_URL, id))
      .then(res => res.data);
  }
}

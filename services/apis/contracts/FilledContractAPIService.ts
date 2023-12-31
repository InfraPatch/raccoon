import axiosService, { APIResponse } from '@/services/axios';
import { IFilledContract } from '@/db/models/contracts/FilledContract';
import { IChatMessage } from '@/db/models/chat/ChatMessage';

export interface NewFilledContractAPIParams {
  friendlyName: string;
  buyerEmail: string;
  contractId: number;
  filledItemId?: number;
}

export interface FilledOption {
  id: number;
  value: string;
}

export interface FillContractOptionAPIParams {
  options: FilledOption[];
}

export interface ListFillContractsAPIResponse extends APIResponse {
  own: IFilledContract[];
  foreign: IFilledContract[];
  witness: IFilledContract[];
}

export interface CreateFilledContractAPIResponse extends APIResponse {
  filledContract: IFilledContract;
}

export interface GetFilledContractAPIResponse extends APIResponse {
  filledContract: IFilledContract;
}

export type FillFilledContractAPIResponse = APIResponse;
export type DeleteFilledContractAPIResponse = APIResponse;

export type AcceptFilledContractAPIResponse = APIResponse;
export type DeclineFilledContractAPIResponse = APIResponse;

export type SignFilledContractAPIResponse = APIResponse;

export interface GetFilledContractChatMessagesAPIResponse extends APIResponse {
  messages: IChatMessage[];
}

const url = (template: string, id: number) =>
  template.replace(':id', id.toString());

export class FilledContractAPIService {
  static LIST_FILLED_CONTRACTS_URL = '/api/filled-contracts';
  static CREATE_FILLED_CONTRACT_URL = '/api/filled-contracts';

  static GET_FILLED_CONTRACT_URL = '/api/filled-contracts/:id';
  static FILL_FILLED_CONTRACT_URL = '/api/filled-contracts/:id';
  static DELETE_FILLED_CONTRACT_URL = '/api/filled-contracts/:id';

  static DOWNLOAD_FILLED_CONTRACT_URL = '/api/filled-contracts/:id/download';

  static ACCEPT_FILLED_CONTRACT_URL = '/api/filled-contracts/:id/accept';
  static DECLINE_FILLED_CONTRACT_URL = '/api/filled-contracts/:id/decline';

  static SIGN_FILLED_CONTRACT_URL = '/api/filled-contracts/:id/sign';

  static FILLED_CONTRACT_CHAT_MESSAGES_URL = '/api/filled-contracts/:id/chat';

  public async listFilledContracts(): Promise<ListFillContractsAPIResponse> {
    return axiosService
      .get(FilledContractAPIService.LIST_FILLED_CONTRACTS_URL)
      .then((res) => res.data);
  }

  public async createFilledContract(
    payload: NewFilledContractAPIParams,
  ): Promise<CreateFilledContractAPIResponse> {
    return axiosService
      .post(FilledContractAPIService.CREATE_FILLED_CONTRACT_URL, payload)
      .then((res) => res.data);
  }

  public async getFilledContract(
    id: number,
  ): Promise<GetFilledContractAPIResponse> {
    return axiosService
      .get(url(FilledContractAPIService.GET_FILLED_CONTRACT_URL, id))
      .then((res) => res.data);
  }

  public async fillFilledContract(
    id: number,
    payload: FillContractOptionAPIParams,
  ): Promise<GetFilledContractAPIResponse> {
    return axiosService
      .put(url(FilledContractAPIService.FILL_FILLED_CONTRACT_URL, id), payload)
      .then((res) => res.data);
  }

  public async deleteFilledContract(
    id: number,
  ): Promise<DeleteFilledContractAPIResponse> {
    return axiosService
      .delete(url(FilledContractAPIService.DELETE_FILLED_CONTRACT_URL, id))
      .then((res) => res.data);
  }

  public async acceptFilledContract(
    id: number,
  ): Promise<AcceptFilledContractAPIResponse> {
    return axiosService
      .patch(url(FilledContractAPIService.ACCEPT_FILLED_CONTRACT_URL, id))
      .then((res) => res.data);
  }

  public async declineFilledContract(
    id: number,
  ): Promise<DeclineFilledContractAPIResponse> {
    return axiosService
      .patch(url(FilledContractAPIService.DECLINE_FILLED_CONTRACT_URL, id))
      .then((res) => res.data);
  }

  public async signFilledContract(
    id: number,
    signatureData: string | null,
  ): Promise<SignFilledContractAPIResponse> {
    return axiosService
      .patch(url(FilledContractAPIService.SIGN_FILLED_CONTRACT_URL, id), {
        signatureData,
      })
      .then((res) => res.data);
  }

  public async getFilledContractChatMessages(
    id: number,
  ): Promise<GetFilledContractChatMessagesAPIResponse> {
    return axiosService
      .get(url(FilledContractAPIService.FILLED_CONTRACT_CHAT_MESSAGES_URL, id))
      .then((res) => res.data);
  }
}

import { APIResponse } from '@/services/axios';
import { IFilledContract } from '@/db/models/contracts/FilledContract';

export interface NewFilledContractAPIParams {
  friendlyName: string;
  buyerEmail: string;
  contractId: number;
};

export interface FilledOption {
  id: number;
  value: string;
}

export interface FillContractOptionAPIParams {
  options: FilledOption[];
};

export interface ListFillContractsAPIResponse extends APIResponse {
  own: IFilledContract[];
  foreign: IFilledContract[];
};

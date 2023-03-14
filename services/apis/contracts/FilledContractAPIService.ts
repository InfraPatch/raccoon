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

import { ContactAPIService } from '@/services/apis/contact/ContactAPIService';
import { CredentialsAuthAPIService } from './auth/CredentialsAuthAPIService';
import { UsersAPIService } from './users/UserAPIService';
import { ContractsAPIService } from './contracts/ContractAPIService';
import { ContractOptionsAPIService } from './contracts/ContractOptionAPIService';
import { FilledContractAPIService } from './contracts/FilledContractAPIService';
import { WitnessSignatureAPIService } from './contracts/WitnessSignatureAPIService';
import { ItemAPIService } from './items/ItemAPIService';
import { ItemOptionAPIService } from './items/ItemOptionAPIService';
import { FilledItemAPIService } from './items/FilledItemAPIService';

class APIService {
  public contact = new ContactAPIService();

  public credentialsAuth = new CredentialsAuthAPIService();
  public users = new UsersAPIService();

  public contracts = new ContractsAPIService();
  public contractOptions = new ContractOptionsAPIService();
  public filledContracts = new FilledContractAPIService();
  public witnessSignatures = new WitnessSignatureAPIService();

  public items = new ItemAPIService();
  public itemOptions = new ItemOptionAPIService();
  public filledItems = new FilledItemAPIService();
};

const apiService = new APIService();
export default apiService;

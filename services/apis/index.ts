import { ContactAPIService } from '@/services/apis/contact/ContactAPIService';
import { CredentialsAuthAPIService } from './auth/CredentialsAuthAPIService';
import { UsersAPIService } from './users/UserAPIService';
import { ContractsAPIService } from './contracts/ContractAPIService';
import { ContractOptionsAPIService } from './contracts/ContractOptionAPIService';
import { FilledContractAPIService } from './contracts/FilledContractAPIService';
import { WitnessSignatureAPIService } from './contracts/WitnessSignatureAPIService';
import { FilledContractAttachmentAPIService } from './contracts/FilledContractAttachmentAPIService';
import { ItemAPIService } from './items/ItemAPIService';
import { ItemOptionAPIService } from './items/ItemOptionAPIService';
import { FilledItemAPIService } from './items/FilledItemAPIService';
import { FilledItemAttachmentAPIService } from './items/FilledItemAttachmentAPIService';

class APIService {
  public contact = new ContactAPIService();

  public credentialsAuth = new CredentialsAuthAPIService();
  public users = new UsersAPIService();

  public contracts = new ContractsAPIService();
  public contractOptions = new ContractOptionsAPIService();
  public filledContracts = new FilledContractAPIService();
  public witnessSignatures = new WitnessSignatureAPIService();
  public filledContractAttachments = new FilledContractAttachmentAPIService();

  public items = new ItemAPIService();
  public itemOptions = new ItemOptionAPIService();
  public filledItems = new FilledItemAPIService();
  public filledItemAttachments = new FilledItemAttachmentAPIService();
}

const apiService = new APIService();
export default apiService;

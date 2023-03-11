import { ContactAPIService } from '@/services/apis/contact/ContactAPIService';
import { CredentialsAuthAPIService } from './auth/CredentialsAuthAPIService';

class APIService {
  public contact = new ContactAPIService();
  public credentialsAuth = new CredentialsAuthAPIService();
};

const apiService = new APIService();
export default apiService;

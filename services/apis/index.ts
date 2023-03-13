import { ContactAPIService } from '@/services/apis/contact/ContactAPIService';
import { CredentialsAuthAPIService } from './auth/CredentialsAuthAPIService';
import { UsersAPIService } from './users/UserAPIService';

class APIService {
  public contact = new ContactAPIService();
  public credentialsAuth = new CredentialsAuthAPIService();
  public users = new UsersAPIService();
};

const apiService = new APIService();
export default apiService;

import { ContactAPIService } from '@/services/apis/contact/ContactAPIService';

class APIService {
  public contact = new ContactAPIService();
};

const apiService = new APIService();
export default apiService;

import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "https://behive-fit.herokuapp.com/api/personal-trainer" || "http://localhost:8080/api/personal-trainer";

class PersonalService {
  getAllPersonal = () => {
    return axios.get(API_URL, { headers: authHeader() });
  };
  getPersonalById = (id) => {
    return axios.get(API_URL+"?id="+id, { headers: authHeader() });
  };
  getPersonalByUserId = (id) => {
    return axios.get(API_URL+"?userId="+id, { headers: authHeader() });
  };
  search = (name) => {
    return axios.get(API_URL+"/search", { headers: authHeader() });
  };
  create(address, brandName, cnpj, commercialPhone, companyName, highPricePct,
    lowPricePct, price, socialMedia, user, workHours, logo, cref, crefExpiration, certificates, graduation, bankData) {
    let payload = {address, brandName, cnpj, commercialPhone, companyName, highPricePct,
                  lowPricePct, price, socialMedia, user, workHours, logo, cref, crefExpiration, certificates, graduation, bankData};
    return axios.post(API_URL, payload, { headers: authHeader() })
    .then((response) => {
      return response;
    });
  };
  getCustomers = (ptId) => {
    return axios.get(API_URL+"/customer?personalTrainerId="+ptId, { headers: authHeader() });
  };
  getGyms = (ptId) => {
    return axios.get(API_URL+"/gym?personalTrainerId="+ptId, { headers: authHeader() });
  };
  createCustomerContract(customerId, personalTrainerId,) {
    return axios.post(API_URL+"/customer", { customerId, personalTrainerId}, { headers: authHeader() })
    .then((response) => {
      return response;
    });
  };
}

export default new PersonalService();
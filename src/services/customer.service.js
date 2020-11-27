import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "https://behive-fit.herokuapp.com/api/customer" || "http://localhost:8080/api/customer";

class PersonalService {
  getAllCustomers = () => {
    return axios.get(API_URL, { headers: authHeader() });
  };
  search = (name) => {
    return axios.get(API_URL+"/search", { headers: authHeader() });
  };
  create(user, address, socialMedia, logo) {
    return axios.post(API_URL, {user, address, socialMedia, logo}, { headers: authHeader() })
    .then((response) => {
      return response;
    });
  };
}

export default new PersonalService();
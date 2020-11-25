import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "https://behive-fit.herokuapp.com/api/gym" || "http://localhost:8080/api/gym";

class GymService {
  getAllGyms = () => {
    return axios.get(API_URL, { headers: authHeader() });
  };
  search = (name) => {
    return axios.get(API_URL+"/search", { headers: authHeader() });
  };
  create(cnpj) {
    return axios.post(API_URL, {cnpj}, { headers: authHeader() })
    .then((response) => {
      return response.data;
    });
  }
}

export default new GymService();
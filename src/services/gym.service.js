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
  create(address, brandName, cnpj, commercialPhone, companyName, highPricePct,
    lowPricePct, price, socialMedia, user, workHours, logo) {
    return axios.post(API_URL, {address, brandName, cnpj, commercialPhone, companyName, highPricePct,
      lowPricePct, price, socialMedia, user, workHours, logo}, { headers: authHeader() })
    .then((response) => {
      return response.data;
    });
  }
}

export default new GymService();
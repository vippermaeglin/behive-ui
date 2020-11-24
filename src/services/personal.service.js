import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "https://behive-fit.herokuapp.com/api/personal-trainer" || "http://localhost:8080/api/personal-trainer";

class PersonalService {
  getAllPersonal = () => {
    return axios.get(API_URL, { headers: authHeader() });
  };
  search = (name) => {
    return axios.get(API_URL+"/search", { headers: authHeader() });
  };
}

export default new PersonalService();
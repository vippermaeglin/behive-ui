import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "https://behive-fit.herokuapp.com/api/gym/" || "http://localhost:8080/api/gym/";

const getAllGyms = () => {
  return axios.get(API_URL, { headers: authHeader() });
};

export default {
  getAllGyms
};
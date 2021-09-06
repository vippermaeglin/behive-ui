import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "https://behive-fit.herokuapp.com/api/wallet" || "http://localhost:8080/api/wallet";
const callbackUrl = API_URL + "/callback"

class WalletService {
  postPayment = (description, reference, token) => {
    let payload = {
      callbackUrl,
      description,
      reference
    }
    return axios.post(API_URL+"/payment?token="+token, payload, { headers: authHeader() })
    .then((response) => {
      return response;
    });
  };
  getBalance = (token) => {
    return axios.get(API_URL+"/balance?token="+token, { headers: authHeader() });
  };
}

export default new WalletService();
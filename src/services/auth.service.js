import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "https://behive-fit.herokuapp.com/api/auth/" || "http://localhost:8080/api/auth/";

class AuthService {
  register = (cpf, email, password, role, phone, userName, birthday, gender) => {
    return axios.post(API_URL + "signup", {
      cpf,
      email,
      password,
      role,
      phone,
      userName,
      birthday,
      gender
    });
  };

  login = (cpf, password) => {
    return axios
      .post(API_URL + "signin", {
        cpf,
        password,
      })
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  };

  getAll = () => {
    return axios
      .get(API_URL + "users", { headers: authHeader() });
  };

  logout = () => {
    localStorage.removeItem("user");
  };

  getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
  };

  getCurrentRole = () => {
    let role = "VISITOR";
    if(this.getCurrentUser() !== null) {
      role = this.getCurrentUser().role;
    }
    return role;
  }

}

export default new AuthService();
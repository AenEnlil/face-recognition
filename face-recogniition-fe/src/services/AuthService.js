import axios from "axios";

const signUp = (data) => {
  return axios.post(`http://localhost:8000/auth/register/`, data);
};

const signIn = (data) => {
  return axios.post(`http://localhost:8000/auth/login/`, data, {
    withCredentials: true,
  });
};

const signOut = () => {
  return axios.get(`http://localhost:8000/auth/logout/`);
};

const AuthService = {
  signUp,
  signIn,
  signOut
};

export default AuthService;

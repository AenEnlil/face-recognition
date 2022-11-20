import axios from "axios";

const signUp = (data) => {
  return axios.post(`http://localhost:8000/auth/register`, data);
};

export default signUp;

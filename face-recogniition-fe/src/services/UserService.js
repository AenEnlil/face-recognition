import axios from "axios";

const getUserProfile = () => {
  return axios.get(`http://localhost:8000/auth/profile/`);
};

const UserService = {
    getUserProfile
};

export default UserService;

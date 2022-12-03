import axios from "axios";

const getUserProfile = () => {
  return axios.get(`http://localhost:8000/auth/profile/`);
};

const postUserImage = (data) => {
  const newData = new FormData();
  newData.append("face_image", data, 'jpeg');
  return axios.patch(`http://localhost:8000/auth/profile/`, newData);
};

const UserService = {
    getUserProfile,
    postUserImage
};

export default UserService;

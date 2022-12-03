import axios from "axios";

const getUserProfile = () => {
  return axios.get(`http://localhost:8000/auth/profile/`);
};

const postUserImage = (data) => {
  const newData = new FormData();
  newData.append("face_image", data, 'jpeg');
  return axios.patch(`http://localhost:8000/auth/profile/`, newData);
};

const deleteUserImage = () => {
  return axios.patch(`http://localhost:8000/auth/profile/?delete_image=True`);
};

const postVisualAuth = (data) => {
  return axios.patch(`http://localhost:8000/auth/profile/`, {
    using_visual_authentication: data
  });
};


const UserService = {
    getUserProfile,
    postUserImage,
    deleteUserImage,
    postVisualAuth
};

export default UserService;

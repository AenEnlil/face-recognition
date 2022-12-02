import { React, useState, useEffect } from "react";
import Switch from "react-switch";

import UserService from "../../services/UserService";

import "./UserProfile.scss";

function UserProfile() {
  const [userInfo, setUserInfo] = useState();
  useEffect(() => {
    if (!userInfo) {
      UserService.getUserProfile().then((result) => {
        setUserInfo(result?.data);
      });
    }
  }, [userInfo]);

  function handleToggleChange() {
    console.log("changed");
  }

  return (
    <>
      <div>User mail: {userInfo?.email}</div>
      <div>
        <label>Use visual verification:</label>
        <Switch onChange={handleToggleChange} checked={userInfo?.using_visual_authentication} />
      </div>
    </>
  );
}

export default UserProfile;

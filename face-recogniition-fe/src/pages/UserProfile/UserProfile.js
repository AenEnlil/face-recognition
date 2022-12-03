import { React, useState, useEffect, useRef, useCallback } from "react";
import Switch from "react-switch";
import Webcam from "react-webcam";

import UserService from "../../services/UserService";

import "./UserProfile.scss";

const videoConstraints = {
  width: 500,
  height: 500,
  facingMode: "user",
};

function UserProfile() {
  const [userInfo, setUserInfo] = useState();
  const [toggleSwitch, setToggleSwitch] = useState(false);
  useEffect(() => {
    if (!userInfo) {
      UserService.getUserProfile().then((result) => {
        setUserInfo(result?.data);
        setToggleSwitch(result?.data?.using_visual_authentication);
      });
    }
  }, [userInfo]);

  function handleToggleChange() {
    setToggleSwitch(!toggleSwitch);
  }

  const [picture, setPicture] = useState("");
  const webcamRef = useRef(null);
  const capture = useCallback(async () => {
    const pictureSrc = webcamRef.current.getScreenshot();
    const blob = await fetch(pictureSrc).then((res) => res.blob());
    setPicture(blob);
  }, []);

  function uploadUserImage() {
    if (picture) {
      console.log("picture: ", picture);
      UserService.postUserImage(picture).then((result) => {
        console.log("status: ", result.status);
      });
    }
  }

  return (
    <>
      <article className="mainContent">
        <div className="leftBlock">
          <section className="userInfo">
            <h2>
              User mail: <span>{userInfo?.email}</span>
            </h2>
          </section>

          <section className="visualAuthBlock">
            <h2>Use visual verification:</h2>
            <div className="toggleBlock">
              <Switch
                onChange={handleToggleChange}
                checked={toggleSwitch && toggleSwitch}
              />
              {userInfo && userInfo?.have_face_image ? (
                <p className="infoMsg positiveWarningMsg">
                  You already have an uploaded image
                </p>
              ) : (
                <p className="infoMsg negativeWarningMsg">
                  You don't have an uploaded image
                </p>
              )}
            </div>
            {userInfo && userInfo?.have_face_image && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                }}
                className="btn btn-primary"
              >
                Retake image
              </button>
            )}
          </section>
        </div>

        {toggleSwitch && !userInfo?.using_visual_authentication && (
          <div className="rightBlock">
            {picture ? (
              <img alt="userImg" src={picture} />
            ) : (
              <Webcam
                audio={false}
                height={400}
                ref={webcamRef}
                width={400}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                mirrored={true}
              />
            )}

            {picture ? (
              <div className="btnBlock">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setPicture();
                  }}
                  className="btn btn-danger"
                >
                  Retake
                </button>

                <button
                  onClick={() => uploadUserImage()}
                  className="btn btn-success"
                >
                  Save image
                </button>
              </div>
            ) : (
              <div className="btnBlock">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    capture();
                  }}
                  className="btn btn-danger"
                >
                  Capture
                </button>
              </div>
            )}
          </div>
        )}
      </article>
    </>
  );
}

export default UserProfile;

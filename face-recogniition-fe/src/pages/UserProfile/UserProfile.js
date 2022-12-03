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
  const [showPictureBlock, setShowPictureBlock] = useState(false);
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

  const [pictureFile, setPictureFile] = useState("");
  const [pictureSrc, setpictureSrc] = useState("");
  const webcamRef = useRef(null);
  const capture = useCallback(async () => {
    const pictureSrc = webcamRef.current.getScreenshot();
    const blob = await fetch(pictureSrc).then((res) => res.blob());
    setPictureFile(blob);
    setpictureSrc(pictureSrc);
  }, []);

  function uploadUserImage() {
    if (pictureFile) {
      UserService.postUserImage(pictureFile).then((result) => {
        setUserInfo(result?.data);
        setToggleSwitch(result?.data?.using_visual_authentication);
      });
    }
  }

  function removeUserImage() {
    console.log('removed');
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
            {userInfo && userInfo?.have_face_image ? (
              <div className="excistedImageBtns">
                <button
                  onClick={() => setShowPictureBlock(true)}
                  className="btn btn-primary"
                >
                  Retake image
                </button>
                <p>Or</p>
                <button
                  onClick={() => removeUserImage()}
                  className="btn btn btn-danger"
                >
                  Remove image
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowPictureBlock(true)}
                className="btn btn-primary"
              >
                Take image
              </button>
            )}
          </section>
        </div>

        {showPictureBlock && (
          <div className="rightBlock">
            {pictureFile && pictureSrc ? (
              <img alt="userImg" src={pictureSrc} />
            ) : (
              <>
                <Webcam
                  audio={false}
                  height={400}
                  ref={webcamRef}
                  width={400}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  mirrored={true}
                />
              </>
            )}

            {pictureFile && pictureSrc ? (
              <div className="btnBlock">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setPictureFile();
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

import { React, useState, useRef, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import Webcam from "react-webcam";

import AuthService from "../../services/AuthService";

import "../SignUp/signUp.scss";
import BgImg from "../../assets/images/sign-up-bg.jpg";
import "./signIn.scss";

const videoConstraints = {
  width: 500,
  height: 500,
  facingMode: "user",
};

function SignIn() {
  const navigate = useNavigate();
  const [servError, setServError] = useState();

  const [visualAuth, setVisualAuth] = useState(false);
  const [userId, setUserId] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    AuthService.signIn(data)
      .then((result) => {
        if (result?.data) {
          if (result?.data?.redirect === false) {
            navigate(`/user-profile`);
            Cookies.set("isLogged", true);
            Cookies.set("access", result?.data?.tokens?.access);
            Cookies.set("refresh", result?.data?.tokens?.refresh);
          } else if (result?.data?.redirect === true) {
            setVisualAuth(true);
            setUserId(result?.data?.user_id);
          }
        }
      })
      .catch((errors) => {
        setServError(errors?.response?.data?.error);
      });
  };

  const [pictureFile, setPictureFile] = useState("");
  const webcamRef = useRef(null);
  const capture = useCallback(async () => {
    const pictureSrc = webcamRef.current.getScreenshot();
    const blob = await fetch(pictureSrc).then((res) => res.blob());
    setPictureFile(blob);
  }, []);

  useEffect(() => {
    if (visualAuth && pictureFile && userId) {
      const newData = new FormData();
      newData.append("face_image", pictureFile, "jpeg");
      newData.append("user_id", userId);
      AuthService.signInVisual(newData).then((result) => {
        console.log("result: ", result?.data);
      });
    }
  }, [visualAuth, pictureFile, userId]);

  return (
    <section className="registerBox">
      <div className="register">
        <div className="col-1">
          <h2>Sign In</h2>
          {!visualAuth ? (
            <>
              <span>Enter your credentials and enjoy the service</span>
              <form
                id="form"
                className="flex flex-col"
                onSubmit={handleSubmit(onSubmit)}
              >
                <input
                  type="text"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: "Please enter a valid email",
                    },
                  })}
                  placeholder="Email"
                />
                {errors.email && (
                  <p className="formError">{errors.email.message}</p>
                )}
                <input
                  type="text"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 5,
                      message: "Must be min 5 chars",
                    },
                  })}
                  placeholder="Password"
                />
                {errors.password && (
                  <p className="formError">{errors.password.message}</p>
                )}
                {servError && <p className="formError">{servError}</p>}
                <button className="signBtn">Sign In</button>
              </form>
            </>
          ) : (
            <div className="visualAuthBlock">
              <span>We need to verify you by your face!</span>
              <span>Pleace, try to look straight to camera!</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  capture();
                }}
                className="signBtn"
              >
                Scan face
              </button>
            </div>
          )}
        </div>
        <div className="col-2">
          {visualAuth ? (
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
          ) : (
            <img src={BgImg} alt="" />
          )}
        </div>
      </div>
    </section>
  );
}

export default SignIn;

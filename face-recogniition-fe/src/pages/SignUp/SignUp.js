import React from "react";
import { useForm } from "react-hook-form";

import signUp from "../../services/SignUpService";

import "./signUp.scss";
import BgImg from "../../assets/images/sign-up-bg.jpg";

function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    signUp(data).then((result) => {
      console.log(result);
    });
  };

  return (
    <section className="registerBox">
      <div className="register">
        <div className="col-1">
          <h2>Sign Up</h2>
          <span>Register and enjoy the service</span>

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
            <button className="btn">Sign Up</button>
          </form>
        </div>
        <div className="col-2">
          <img src={BgImg} alt="" />
        </div>
      </div>
    </section>
  );
}

export default SignUp;

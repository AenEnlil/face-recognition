import axios from "axios";
import Cookies from "js-cookie";

function Interceptor() {
  axios.interceptors.request.use(
    (config) => {
      const accessToken = Cookies.get("access");

      if (accessToken) {
        config.headers["Authorization"] = "Bearer " + accessToken;
      }
      config.headers["Content-Type"] = "application/json";
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    function (error) {
      const originalRequest = error.config;
      if (
        error.response.status === 401 &&
        originalRequest.url ===
          'http://localhost:8000/auth/refresh-token/'
      ) {
        return Promise.reject(error);
      }

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const accessToken = Cookies.get("access");
        const refreshToken = Cookies.get("refresh");
        return axios
          .post('http://localhost:8000/auth/refresh-token/', {
            refresh: refreshToken,
          })
          .then((res) => {
            if (res.status === 200) {
              if (window.location.hostname === "localhost") {
                Cookies.set("access", res.data.access, {
                  domain: "localhost",
                });
                Cookies.set("refresh", res.data.refresh, {
                  domain: "localhost",
                });
              } 
              axios.defaults.headers.common["Authorization"] =
                "Bearer " + accessToken;
              return axios(originalRequest);
            }
          })
          .catch((error) => {
            if (error) {
              return (window.location.href = 'http://localhost:3000/');
            }
          });
      }
      return Promise.reject(error);
    }
  );
}

export default Interceptor;

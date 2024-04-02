import config from "@/config";
import axios from "axios";
import crypto from "crypto-js";

export const customAxios = axios.create({
  baseURL: config.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

customAxios.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("access-token");

    if (accessToken) {
      const header: any = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };
      config.headers = header;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: Array<any> = [];

const processQueue = (error: any, token: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

customAxios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const originalRequest = error.config;
    const pathname = window.location.pathname;
    const isLandingNew = pathname === "/main-page";

    // handling error login from landing-page
    if (error && isLandingNew) {
      return Promise.reject({
        ...error,
      });
    }
    if (
      error?.response?.data?.message === "Another Login Detected" ||
      error?.message === "Another Login Detected"
    ) {
      localStorage.removeItem("access-token");
      localStorage.removeItem("refresh-token");
      window.location.href = "/main-page?logout=true";
      return;
    }

    if (error?.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return customAxios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refresh-token");
      if (!refreshToken) {
        window.location.href = "/main-page?logout=true";
      }

      return new Promise(function (resolve, reject) {
        customAxios
          .post("/auth/refresh", { refreshToken })
          .then(({ data }) => {
            if (data.data.accessToken === "" || data.data.refreshToken === "") {
              localStorage.removeItem("access-token");
              localStorage.removeItem("refresh-token");

              window.location.href = "/main-page?logout=true";

              return;
            }

            const token = data?.data?.accessToken;
            const refreshToken = data?.data?.accessToken;
            const companyID = data?.data?.companyID;
            const userID = data?.data?.userID;

            localStorage.setItem("access-token", token);
            localStorage.setItem("refresh-token", refreshToken);

            customAxios.defaults.headers.common["Authorization"] =
              "Bearer " + token;
            originalRequest.headers["Authorization"] = "Bearer " + token;

            if (
              originalRequest.data !== undefined &&
              originalRequest.data !== null
            ) {
              if (
                originalRequest.headers["Content-Type"]
                  .toString()
                  .includes("json")
              ) {
                const rep = JSON.parse(originalRequest.data);

                const signature = CreateSignature(
                  rep,
                  companyID,
                  userID,
                  process.env["NEXT_PUBLIC_SIGNATURE"],
                  token
                );
                originalRequest.headers["Grpc-Metadata-Signature"] = signature;
              } else if (
                originalRequest.headers["Content-Type"]
                  .toString()
                  .includes("url")
              ) {
                const decode = decodeURIComponent(originalRequest.data);
                const split = decode.split("=");
                const rep = JSON.parse(split[1]);

                const signature = CreateSignature(
                  rep,
                  companyID,
                  userID,
                  process.env["NEXT_PUBLIC_SIGNATURE"],
                  token
                );
                originalRequest.headers["Grpc-Metadata-Signature"] = signature;
              }
            }

            processQueue(null, token);

            resolve(customAxios(originalRequest));
          })
          .catch((err) => {
            if (
              err?.response?.data?.code === 404 &&
              err?.response?.data?.message === "Not Found"
            ) {
              localStorage.removeItem("access-token");
              localStorage.removeItem("refresh-token");

              window.location.href = "/main-page?logout=true";

              return;
            }

            processQueue(err, null);
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }
    if (!error.response) {
      return Promise.reject({
        ...error,
        response: {
          data: { error: true, code: 504, message: "Connection Timeout" },
        },
      });
    }
    return Promise.reject(error);
  }
);
const CreateSignature = (
  params: any,
  companyID: any,
  userID: any,
  key: any,
  token: any
) => {
  const data =
    `bodydata:` +
    JSON.stringify(params) +
    `&bearer:${token}&companyid:` +
    companyID +
    `&userid:` +
    userID;

  const hash = crypto.HmacSHA256(data, key);
  return hash.toString(crypto.enc.Hex);
};

export default customAxios;

import axios from "axios";
export const USERBASEURL = "http://localhost:8000";
export const PRODUCTBASEURL = "http://localhost:8001";

const APIUSER = axios.create({
  baseURL: `${USERBASEURL}/api`,
  withCredentials: true,
});

const APIPRODUCT = axios.create({
  baseURL: `${PRODUCTBASEURL}/api`,
});

const getCsrfToken = async () => {
  await axios.get(`${USERBASEURL}/sanctum/csrf-cookie`);
};

APIUSER.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

APIPRODUCT.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { APIPRODUCT, APIUSER, getCsrfToken };

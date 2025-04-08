import axios from "axios";

const http = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: "http://localhost:3000",
});

http.interceptors.request.use((config) => {
  const sessionToken = sessionStorage.getItem("SESSION");

  if (sessionToken && !config?.headers.Authorization) {
    config.headers.Authorization = `Bearer ${sessionToken}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response.status === 401) {
      sessionStorage.removeItem("SESSION");
      sessionStorage.removeItem("USER");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    throw error.response.data;
  }
);

export default http;

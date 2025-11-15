import axios from "axios";

const API = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
});

// REGISTER
export const registerUser = async (formData) => {
  const response = await API.post("/register", formData);
  return response.data;
};

// LOGIN
export const loginUser = async (formData) => {
  const response = await API.post("/login", formData);
  return response.data;
};

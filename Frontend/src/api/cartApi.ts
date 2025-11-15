import axios from "axios";

const API = axios.create({
  baseURL: "/api/cart",
  withCredentials: true,
});

// Attach token from localStorage for protected routes
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const cartApi = {
  getCart: async () => {
    const res = await API.get("/");
    return res.data;
  },
  addToCart: async (productId: string, quantity = 1) => {
    const res = await API.post("/items", { productId, quantity });
    return res.data;
  },
  updateCartItem: async (itemId: string, quantity: number) => {
    const res = await API.put(`/items/${itemId}`, { quantity });
    return res.data;
  },
  removeCartItem: async (itemId: string) => {
    const res = await API.delete(`/items/${itemId}`);
    return res.data;
  },
  clearCart: async () => {
    const res = await API.delete(`/`);
    return res.data;
  },
  checkoutCart: async () => {
    const res = await API.post(`/checkout`);
    return res.data;
  },
};

export default cartApi;

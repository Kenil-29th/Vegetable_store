const API_URL = "/api/admin";

export const adminApi = {
  getSuppliers: async () => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`${API_URL}/suppliers`, { headers, credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch suppliers");
    return res.json();
  },
  getCustomers: async () => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`${API_URL}/customers`, { headers, credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch customers");
    return res.json();
  },
  getProducts: async () => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`${API_URL}/products`, { headers, credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  },
  toggleUserStatus: async (userId, status) => {
    const token = localStorage.getItem("token");
    const headers: { [key: string]: string } = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${API_URL}/users/${userId}/status`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to update user status");
    return res.json();
  },
  toggleProductStatus: async (productId, isActive) => {
    const token = localStorage.getItem("token");
    const headers: { [key: string]: string } = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${API_URL}/products/${productId}/status`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ isActive }),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to update product status");
    return res.json();
  },
};

import { CreateProductDto, Product, UpdateProductDto } from "@/types/product";

const API_URL = "/api/products";

export const productApi = {
  create: async (data: CreateProductDto): Promise<Product> => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append('image', value);
        } else {
          formData.append(key, String(value));
        }
      });

      const token = localStorage.getItem("token");
      const headers: { [key: string]: string } = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create product');
      }

      return response.json();
    } catch (error) {
      console.error('Error creating product:', error);
      throw error instanceof Error ? error : new Error('Failed to create product');
    }
  },

  list: async (): Promise<Product[]> => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch products');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error instanceof Error ? error : new Error('Failed to fetch products');
    }
  },

  getById: async (id: string): Promise<Product> => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch product');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error instanceof Error ? error : new Error('Failed to fetch product');
    }
  },

  update: async (id: string, data: UpdateProductDto): Promise<Product> => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append('image', value);
        } else if (value !== undefined) {
          formData.append(key, String(value));
        }
      });

      const token = localStorage.getItem("token");
      const headers: { [key: string]: string } = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers,
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update product');
      }

      return response.json();
    } catch (error) {
      console.error('Error updating product:', error);
      throw error instanceof Error ? error : new Error('Failed to update product');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      const headers: { [key: string]: string } = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error instanceof Error ? error : new Error('Failed to delete product');
    }
  },
};
export interface Product {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  description: string;
  image?: string;
  isActive: boolean;
  category: string;
  sku: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  quantity: number;
  price: number;
  description: string;
  isActive: boolean;
  category: string;
  sku: string;
  image?: File;
}

export type UpdateProductDto = Partial<CreateProductDto>;
import React from "react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

interface Props {
  product: Product;
  onAddToCart?: (id: string) => void;
}

export const ProductDetail: React.FC<Props> = ({ product, onAddToCart }) => {
  const imageSrc = product.image ? `/${product.image.replace(/^\//, "")}` : undefined;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          {imageSrc ? (
            // backend serves uploads under /uploads/... so image path is relative
            <img src={imageSrc} alt={product.name} className="w-full h-64 object-cover rounded-md" />
          ) : (
            <div className="w-full h-64 bg-muted rounded-md flex items-center justify-center text-6xl">
              🥬
            </div>
          )}
        </div>

        <div className="col-span-2">
          <div className="mb-4">
            <p className="text-lg font-medium">Category: <span className="font-normal">{product.category}</span></p>
            <p className="text-lg font-medium">SKU: <span className="font-normal">{product.sku}</span></p>
            <p className="text-lg font-medium">Status: <span className="font-normal">{product.isActive ? 'Active' : 'Inactive'}</span></p>
          </div>

          <div className="mb-6">
            <p className="text-2xl font-bold text-primary">${Number(product.price).toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Quantity available: {product.quantity}</p>
          </div>

          <div className="prose max-w-none mb-6">
            <p>{product.description}</p>
          </div>

          <CardFooter className="p-0">
            <div className="flex gap-3">
              <Button onClick={() => onAddToCart?.(product._id)}>Add to Cart</Button>
              <Button variant="secondary">Buy Now</Button>
            </div>
          </CardFooter>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductDetail;

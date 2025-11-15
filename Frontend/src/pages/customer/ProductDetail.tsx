import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productApi } from "@/api/productApi";
import { Product } from "@/types/product";
import { ProductDetail } from "@/components/products/ProductDetail";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cartApi } from "@/api/cartApi";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const p = await productApi.getById(id);
        setProduct(p);
      } catch (err) {
        console.error("Error loading product by id:", err);
        toast({ variant: "destructive", title: "Error", description: "Failed to load product" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, toast]);

  const handleAddToCart = async (productId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast({ variant: "destructive", title: "Not authenticated", description: "Please login to add items to cart" });
      navigate("/login");
      return;
    }
    const updatedCart = await cartApi.getCart();
localStorage.setItem("cart", JSON.stringify(updatedCart.items || []));
window.dispatchEvent(new Event("storage"));


    try {
      await cartApi.addToCart(productId, 1);
      toast({ title: "Added to cart", description: "Product added to your cart" });
    } catch (err: unknown) {
      console.error("Failed add to cart:", err);
      type Err = { response?: { data?: { message?: string } }; message?: string };
      const e = err as Err;
      toast({ variant: "destructive", title: "Error", description: e?.response?.data?.message || e?.message || "Failed to add to cart" });
    }
  };

  if (loading) return <div className="container mx-auto py-10">Loading...</div>;
  if (!product) return (
    <div className="container mx-auto py-10">
      <p>Product not found.</p>
      <Button onClick={() => navigate(-1)} className="mt-4">Go back</Button>
    </div>
  );

  return (
    <div className="container mx-auto py-10">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">Back</Button>
      <ProductDetail product={product} onAddToCart={handleAddToCart} />
    </div>
  );
};

export default ProductDetailPage;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartView from "@/components/cart/CartView";
import { cartApi } from "@/api/cartApi";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/types/product";

type CartItem = {
  _id: string;
  product: Product | string;
  quantity: number;
  price: number;
  // allow extra fields from the API without strict typing
  [key: string]: unknown;
};

type Cart = {
  items: CartItem[];
  total?: number;
  // allow extra fields from the API without strict typing
  [key: string]: unknown;
};

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const c = await cartApi.getCart();
        setCart(c as Cart);
      } catch (err: unknown) {
        console.error("Failed to load cart:", err);
        type Err = { response?: { data?: { message?: string } }; message?: string };
        const e = err as Err;
        toast({ variant: "destructive", title: "Error", description: e?.response?.data?.message || e?.message || "Failed to load cart" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate, toast]);

  const handleCartUpdated = (updatedCart: Cart) => {
    setCart(updatedCart);
  };

  if (loading) return <div className="container mx-auto py-10">Loading cart...</div>;
  if (!cart) return <div className="container mx-auto py-10">No cart found.</div>;

  return (
    <div className="container mx-auto py-10">
      <CartView items={cart.items || []} total={cart.total || 0} onCartUpdated={handleCartUpdated} />
    </div>
  );
};

export default CartPage;

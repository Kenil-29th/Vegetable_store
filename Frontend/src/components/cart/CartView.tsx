import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { X, Minus, Plus } from "lucide-react";
import { cartApi } from "@/api/cartApi";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/types/product";
import { useNavigate } from "react-router-dom";

type CartItem = {
  _id: string;
  product: Product | string;
  quantity: number;
  price: number;
};

interface Props {
  items: CartItem[];
  total?: number;
  onCartUpdated?: (cart: Record<string, unknown>) => void; // returned cart object
}

export const CartView: React.FC<Props> = ({ items, total = 0, onCartUpdated }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loadingItem, setLoadingItem] = useState<string | null>(null);
  const [showBill, setShowBill] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      setLoadingItem(itemId);
      const updated = await cartApi.updateCartItem(itemId, quantity);
      onCartUpdated?.(updated);
      toast({ title: "Updated", description: "Cart updated" });
    } catch (err: unknown) {
      console.error("Failed to update cart item:", err);
      type Err = { response?: { data?: { message?: string } }; message?: string };
      const e = err as Err;
      toast({ variant: "destructive", title: "Error", description: e?.response?.data?.message || e?.message || "Failed to update cart" });
    } finally {
      setLoadingItem(null);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setLoadingItem(itemId);
      const updated = await cartApi.removeCartItem(itemId);
      onCartUpdated?.(updated);
      toast({ title: "Removed", description: "Item removed from cart" });
    } catch (err: unknown) {
      console.error("Failed to remove cart item:", err);
      type Err = { response?: { data?: { message?: string } }; message?: string };
      const e = err as Err;
      toast({ variant: "destructive", title: "Error", description: e?.response?.data?.message || e?.message || "Failed to remove item" });
    } finally {
      setLoadingItem(null);
    }
  };

  const clearCart = async () => {
    try {
      const updated = await cartApi.clearCart();
      onCartUpdated?.(updated);
      toast({ title: "Cleared", description: "Cart cleared" });
    } catch (err: unknown) {
      console.error("Failed to clear cart:", err);
      type Err = { response?: { data?: { message?: string } }; message?: string };
      const e = err as Err;
      toast({ variant: "destructive", title: "Error", description: e?.response?.data?.message || e?.message || "Failed to clear cart" });
    }
  };

  const handleCheckout = () => {
    setShowBill(true);
  };

  const confirmCheckout = async () => {
    try {
      setCheckoutLoading(true);
      await cartApi.checkoutCart();
      toast({ title: "Order Placed", description: "Your order has been placed successfully!" });
      onCartUpdated?.({ items: [], total: 0 }); // Clear cart locally
      setShowBill(false);
      navigate("/");
    } catch (err: unknown) {
      console.error("Failed to checkout:", err);
      type Err = { response?: { data?: { message?: string } }; message?: string };
      const e = err as Err;
      toast({ variant: "destructive", title: "Error", description: e?.response?.data?.message || e?.message || "Failed to place order" });
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>My Cart</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground">Your cart is empty</p>
          ) : (
            items.map((it) => {
              const product = typeof it.product === "string" ? ({} as Product) : it.product as Product;
              const imageSrc = product?.image ? `/${(product.image || "").replace(/^\//, "")}` : undefined;
              return (
                <div key={it._id} className="flex items-center gap-4 border-b pb-4">
                  <div className="w-24 h-24 bg-muted rounded overflow-hidden flex items-center justify-center">
                    {imageSrc ? (
                      <img src={imageSrc} alt={product?.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-3xl">🥬</div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{product?.name ?? "Product"}</h4>
                        <p className="text-sm text-muted-foreground">${Number(it.price).toFixed(2)}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeItem(it._id)} disabled={loadingItem === it._id}>
                        <X />
                      </Button>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <Button size="icon" variant="outline" onClick={() => updateQuantity(it._id, it.quantity - 1)} disabled={loadingItem === it._id || it.quantity <= 1}>
                        <Minus />
                      </Button>
                      <Input value={String(it.quantity)} readOnly className="w-16 text-center" />
                      <Button size="icon" variant="outline" onClick={() => updateQuantity(it._id, it.quantity + 1)} disabled={loadingItem === it._id}>
                        <Plus />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="text-xl font-bold">${Number(total || items.reduce((s, i) => s + i.price * i.quantity, 0)).toFixed(2)}</div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={clearCart} disabled={items.length === 0}>Clear Cart</Button>
            <Button onClick={handleCheckout} disabled={items.length === 0}>Checkout</Button>
          </div>
        </CardFooter>
      </Card>

      {/* Bill Dialog */}
      <Dialog open={showBill} onOpenChange={setShowBill}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order Summary</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {items.map((it) => {
              const product = typeof it.product === "string" ? ({} as Product) : it.product as Product;
              return (
                <div key={it._id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{product?.name ?? "Product"}</p>
                    <p className="text-sm text-muted-foreground">Qty: {it.quantity}</p>
                  </div>
                  <p className="font-medium">${(it.price * it.quantity).toFixed(2)}</p>
                </div>
              );
            })}
            <div className="border-t pt-4 flex justify-between items-center font-bold">
              <span>Total</span>
              <span>${Number(total || items.reduce((s, i) => s + i.price * i.quantity, 0)).toFixed(2)}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBill(false)}>Cancel</Button>
            <Button onClick={confirmCheckout} disabled={checkoutLoading}>
              {checkoutLoading ? "Processing..." : "Confirm Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CartView;

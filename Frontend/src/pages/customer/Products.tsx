import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Search, User, LogOut, ShoppingBasket } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { productApi } from "@/api/productApi";
import { cartApi } from "@/api/cartApi";
import { Product } from "@/types/product";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await productApi.list();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        toast({ variant: "destructive", title: "Error", description: "Failed to load products" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [toast]);

  // Load existing cart if authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const loadCart = async () => {
      try {
        const c = await cartApi.getCart();
        const items = c.items || [];
        type CartItem = { _id?: string; id?: string; product?: string };
        setCart(items.map((it: CartItem) => it._id ?? it.id ?? it.product ?? ""));
      } catch (err) {
        console.error("Failed to load cart:", err);
      }
    };
    loadCart();
  }, []);

  const addToCart = async (productId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast({ variant: "destructive", title: "Not authenticated", description: "Please login to add items to cart" });
      navigate("/login");
      return;
    }



    try {
      const cart = await cartApi.addToCart(productId, 1);
      const items = cart.items || [];
      type CartItem = { _id?: string; id?: string; product?: string };
      setCart(items.map((it: CartItem) => it._id ?? it.id ?? it.product ?? ""));
      toast({ title: "Added", description: "Product added to cart" });
      localStorage.setItem("cart", JSON.stringify(items));
      window.dispatchEvent(new Event("storage"));
    } catch (err: unknown) {
      console.error("Failed to add to cart:", err);
      type Err = { response?: { data?: { message?: string } }; message?: string };
      const e = err as Err;
      toast({ variant: "destructive", title: "Error", description: e?.response?.data?.message || e?.message || "Failed to add to cart" });
    }
  };

  const filtered = products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}

      <Header />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for products..."
              className="pl-10 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Products Grid */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Products</h2>
          {loading ? (
            <p>Loading products...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((product) => (
                <Card key={product._id} className="overflow-hidden hover:shadow-card-hover transition-shadow">
                  <CardContent className="p-6">
                    <div className="h-40 mb-4">
                      {product.image ? (
                        <img src={`/${product.image.replace(/^\//, "")}`} alt={product.name} className="w-full h-full object-cover rounded-md" />
                      ) : (
                        <div className="w-full h-full bg-muted rounded-md flex items-center justify-center text-6xl">🥬</div>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">${Number(product.price).toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground">Qty: {product.quantity}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 gap-2">
                    <Button className="flex-1" onClick={() => addToCart(product._id)}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Link to={`/customer/products/${product._id}`} className="flex-1">
                      <Button variant="secondary" className="w-full">View</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;

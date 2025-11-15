import { Button } from "@/components/ui/button";
import {  Leaf, TrendingUp, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { productApi } from "@/api/productApi";
import { Product } from "@/types/product";

const ProductPreview: React.FC = () => {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await productApi.list();
        if (!mounted) return;
        setItems(data.slice(0, 3));
      } catch (err) {
        console.error("Failed to load preview products:", err);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (items.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-2xl p-6 animate-pulse h-56" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((p) => (
        <div key={p._id} className="group bg-card rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 cursor-pointer">
          <div className="h-40 mb-3">
            {p.image ? (
              <img src={`/${p.image.replace(/^\//, "")}`} alt={p.name} className="w-full h-full object-cover rounded-md" />
            ) : (
              <div className="w-full h-full bg-muted rounded-md flex items-center justify-center text-6xl">🥬</div>
            )}
          </div>
          <div className="space-y-1">
            <h4 className="font-semibold text-foreground text-lg">{p.name}</h4>
            <p className="text-primary font-bold">${Number(p.price).toFixed(2)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-full mb-6">
              <Leaf className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-accent-foreground">Fresh From Farm to Your Door</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Fresh Vegetables
              <span className="block text-primary">Delivered Daily</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience the farm-fresh quality of organic vegetables delivered straight to your doorstep. 
              Supporting local farmers while nourishing your family.
            </p>
            <div className="flex gap-4 justify-center flx-wrap">
              <Button size="lg" onClick={() => navigate("/customer/products")}>
                Start Shopping
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/register")}>
                Become a Supplier
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-accent/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl shadow-sm hover:shadow-card-hover transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">100% Organic</h3>
              <p className="text-muted-foreground">
                All our vegetables are grown naturally without harmful pesticides or chemicals.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-2xl shadow-sm hover:shadow-card-hover transition-shadow">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Fair Prices</h3>
              <p className="text-muted-foreground">
                Direct from farmers to consumers, ensuring fair prices for everyone involved.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-sm hover:shadow-card-hover transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Community First</h3>
              <p className="text-muted-foreground">
                Supporting local farmers and building stronger, healthier communities together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vegetable Display Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Fresh Vegetables Available Now
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Handpicked seasonal vegetables, delivered fresh from local farms every morning
            </p>
          </div>

          {/* Preview 3 products */}
          <ProductPreview />

          

          <div className="text-center mt-12">
            <Button size="lg" onClick={() => navigate("/customer/products")}>
              View All Vegetables
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="bg-hero-gradient rounded-3xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Go Green?</h2>
            <p className="text-xl mb-8 opacity-90">Join thousands of happy customers enjoying fresh, organic vegetables</p>
            <Button size="lg" variant="secondary" onClick={() => navigate("/register")}>
              Create Your Account
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 GreenBasket. Fresh vegetables delivered with love.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

import { ShoppingBasket, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState<number>(0);

  // ✅ Check token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // ✅ Load cart count from localStorage when app starts
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);

    // Listen for storage updates (if changed from other tabs/components)
    const handleStorage = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(updatedCart.length);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    setIsLoggedIn(false);
    setCartCount(0);
    navigate("/login");
  };

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <ShoppingBasket className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">
              GreenBasket
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 items-center">
            {!isLoggedIn ? (
              <>
                <Button variant="outline" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button onClick={() => navigate("/register")}>Get Started</Button>
              </>
            ) : (
              <>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate("/customer/cart");
                    }}
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </Button>

                  {/* 🔢 Badge for cart count */}
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <Button variant="destructive" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;

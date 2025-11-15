import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
// import Auth from "./pages/Auth";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Products from "./pages/customer/Products";
import ProductDetailPage from "./pages/customer/ProductDetail";
import CartPage from "./pages/customer/Cart";
import SupplierDashboard from "./pages/supplier/Dashboard";
import SupplierProducts from "./pages/supplier/Products";
import AdminDashboard from "./pages/admin/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/customer/products" element={<Products />} />
          <Route path="/customer/products/:id" element={<ProductDetailPage />} />
          <Route path="/customer/cart" element={<CartPage />} />
          <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
          {/* <Route path="/supplier/products" element={<SupplierProducts />} /> */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

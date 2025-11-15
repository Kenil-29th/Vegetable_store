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
import ProtectedRoute from "./components/ProtectedRoute";

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
          <Route 
            path="/customer/products" 
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <Products />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/customer/products/:id" 
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <ProductDetailPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/customer/cart" 
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <CartPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/supplier/dashboard" 
            element={
              <ProtectedRoute allowedRoles={["supplier"]}>
                <SupplierDashboard />
              </ProtectedRoute>
            } 
          />
          {/* <Route path="/supplier/products" element={<SupplierProducts />} /> */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

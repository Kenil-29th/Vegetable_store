import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingBasket, ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState<"login" | "register" | "forgot">(initialMode);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: searchParams.get("role") || "customer",
    mobile: "",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "register") {
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            variant: "destructive",
          });
          return;
        }
        
        // TODO: Implement registration with backend
        toast({
          title: "Success",
          description: "Account created! Please login.",
        });
        setMode("login");
      } else if (mode === "login") {
        // TODO: Implement login with backend
        // For now, redirect based on role
        const roleRoutes = {
          admin: "/admin/dashboard",
          supplier: "/supplier/dashboard",
          customer: "/customer/products",
        };
        
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
        
        navigate(roleRoutes[formData.role as keyof typeof roleRoutes]);
      } else {
        // TODO: Implement forgot password
        toast({
          title: "Success",
          description: "Password reset link sent to your email.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <ShoppingBasket className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">
              {mode === "login" && "Welcome Back"}
              {mode === "register" && "Create Account"}
              {mode === "forgot" && "Reset Password"}
            </CardTitle>
            <CardDescription>
              {mode === "login" && "Login to your GreenBasket account"}
              {mode === "register" && "Start your fresh vegetable journey"}
              {mode === "forgot" && "We'll send you a reset link"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">I am a</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData({ ...formData, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="supplier">Supplier</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              {mode !== "forgot" && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              )}

              {mode === "register" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="+1 234 567 8900"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Main St, City, State"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>
                </>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Please wait..." : mode === "login" ? "Login" : mode === "register" ? "Create Account" : "Send Reset Link"}
              </Button>

              <div className="text-center text-sm space-y-2">
                {mode === "login" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-primary hover:underline block w-full"
                    >
                      Forgot password?
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("register")}
                      className="text-muted-foreground hover:text-foreground block w-full"
                    >
                      Don't have an account? <span className="text-primary">Sign up</span>
                    </button>
                  </>
                )}
                {(mode === "register" || mode === "forgot") && (
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-muted-foreground hover:text-foreground block w-full"
                  >
                    Already have an account? <span className="text-primary">Login</span>
                  </button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;

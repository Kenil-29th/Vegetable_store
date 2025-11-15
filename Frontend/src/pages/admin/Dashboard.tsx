import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { adminApi } from "@/api/adminApi";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  // add minimal types and state so identifiers used in the JSX exist
  type Supplier = { _id: string; name: string; email: string; status: boolean };
  type Customer = { _id: string; name: string; email: string; status: boolean };
  type Product = {
    _id: string;
    name: string;
    category?: string;
    supplier?: { name: string } | null;
    price: number | string;
    isActive: boolean;
  };

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // load admin data
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const [sup, cust, prods] = await Promise.all([
          adminApi.getSuppliers(),
          adminApi.getCustomers(),
          adminApi.getProducts(),
        ]);
        if (!mounted) return;
        setSuppliers(sup || []);
        setCustomers(cust || []);
        setProducts(prods || []);
      } catch (err) {
        console.error('Failed to load admin data', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const handleToggleUser = async (id: string, newStatus: boolean) => {
    try {
      await adminApi.toggleUserStatus(id, newStatus);
      // toggle in suppliers and customers if present
      setSuppliers((prev) => prev.map((s) => (s._id === id ? { ...s, status: newStatus } : s)));
      setCustomers((prev) => prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c)));
    } catch (err) {
      console.error('Failed to update user status', err);
    }
  };

  const handleToggleProduct = async (id: string, newStatus: boolean) => {
    try {
      await adminApi.toggleProductStatus(id, newStatus);
      setProducts((prev) => prev.map((p) => (p._id === id ? { ...p, isActive: newStatus } : p)));
    } catch (err) {
      console.error('Failed to update product status', err);
    }
  };

  // ✅ Check token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const stats = [
    { title: "Total Suppliers", value: suppliers.length.toString(), icon: Users, color: "text-primary", trend: "" },
    { title: "Total Customers", value: customers.length.toString(), icon: Users, color: "text-secondary", trend: "" },
    { title: "Total Products", value: products.length.toString(), icon: Package, color: "text-primary", trend: "" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage GreenBasket platform</p>
            </div>
            <div className="flex gap-3">
              {/* <Button variant="outline" onClick={() => navigate("/")}>
                Back to Home
              </Button> */}
              <div className="flex gap-3">
                {!isLoggedIn ? (
                  <>
                    <Button variant="outline" onClick={() => navigate("/login")}>
                      Login
                    </Button>
                    <Button onClick={() => navigate("/register")}>
                      Get Started
                    </Button>
                  </>
                ) : (
                  <Button variant="destructive" onClick={handleLogout}>
                    Logout
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-card-hover transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="flex items-center gap-1 text-sm text-primary">
                    <TrendingUp className="h-4 w-4" />
                    <span>{stat.trend}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Suppliers Table */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="w-full overflow-hidden rounded-md border">
                <table className="min-w-full w-full table-fixed">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loading ? (
                      <tr><td colSpan={4} className="px-4 py-6 text-center">Loading...</td></tr>
                    ) : suppliers.length === 0 ? (
                      <tr><td colSpan={4} className="px-4 py-6 text-center">No suppliers found</td></tr>
                    ) : suppliers.map((s, idx) => (
                      <tr key={s._id} className={`${idx % 2 === 0 ? 'bg-card' : ''} hover:bg-accent/5`}> 
                        <td className="px-4 py-3 align-top text-sm text-foreground">{s.name}</td>
                        <td className="px-4 py-3 align-top text-sm text-muted-foreground">{s.email}</td>
                        <td className="px-4 py-3 align-top text-sm">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${s.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {s.status ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 align-top text-right">
                          <Button size="sm" variant={s.status ? "destructive" : "outline"} onClick={() => handleToggleUser(s._id, !s.status)}>
                            {s.status ? "Deactivate" : "Activate"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="w-full overflow-hidden rounded-md border">
                <table className="min-w-full w-full table-fixed">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loading ? (
                      <tr><td colSpan={4} className="px-4 py-6 text-center">Loading...</td></tr>
                    ) : customers.length === 0 ? (
                      <tr><td colSpan={4} className="px-4 py-6 text-center">No customers found</td></tr>
                    ) : customers.map((c, idx) => (
                      <tr key={c._id} className={`${idx % 2 === 0 ? 'bg-card' : ''} hover:bg-accent/5`}>
                        <td className="px-4 py-3 align-top text-sm text-foreground">{c.name}</td>
                        <td className="px-4 py-3 align-top text-sm text-muted-foreground">{c.email}</td>
                        <td className="px-4 py-3 align-top text-sm">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${c.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {c.status ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 align-top text-right">
                          <Button size="sm" variant={c.status ? "destructive" : "outline"} onClick={() => handleToggleUser(c._id, !c.status)}>
                            {c.status ? "Deactivate" : "Activate"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="w-full overflow-hidden rounded-md border">
                <table className="min-w-full w-full table-fixed">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Category</th>
                      {/* <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Supplier</th> */}
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Price</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loading ? (
                      <tr><td colSpan={6} className="px-4 py-6 text-center">Loading...</td></tr>
                    ) : products.length === 0 ? (
                      <tr><td colSpan={6} className="px-4 py-6 text-center">No products found</td></tr>
                    ) : products.map((p, idx) => (
                      <tr key={p._id} className={`${idx % 2 === 0 ? 'bg-card' : ''} hover:bg-accent/5`}>
                        <td className="px-4 py-3 align-top text-sm text-foreground">{p.name}</td>
                        <td className="px-4 py-3 align-top text-sm text-muted-foreground">{p.category}</td>
                        {/* <td className="px-4 py-3 align-top text-sm text-muted-foreground">{p.supplier?.name || '-'}</td> */}
                        <td className="px-4 py-3 align-top text-sm text-foreground">${Number(p.price).toFixed(2)}</td>
                        <td className="px-4 py-3 align-top text-sm">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {p.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 align-top text-right">
                          <Button size="sm" variant={p.isActive ? "destructive" : "outline"} onClick={() => handleToggleProduct(p._id, !p.isActive)}>
                            {p.isActive ? "Deactivate" : "Activate"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Package, DollarSign, UserCheck, Headphones, Truck, Tag, Receipt } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.ico";

const dashboards = [
  {
    title: "Admin Dashboard",
    description: "Manage sellers, products, orders, and staff",
    icon: Shield,
    path: "/admin",
    color: "bg-orange"
  },
  {
    title: "Product Moderator",
    description: "Review and moderate product listings",
    icon: Package,
    path: "/moderator",
    color: "bg-blue"
  },
  {
    title: "Finance Dashboard",
    description: "Manage payments and invoices",
    icon: DollarSign,
    path: "/finance",
    color: "bg-orange"
  },
  {
    title: "Onboarding Dashboard",
    description: "Process seller KYC and onboarding",
    icon: UserCheck,
    path: "/onboarding",
    color: "bg-blue"
  },
  {
    title: "Support Dashboard",
    description: "Handle customer support tickets",
    icon: Headphones,
    path: "/support",
    color: "bg-orange"
  },
  {
    title: "Delivery Dashboard",
    description: "Manage deliveries and earnings",
    icon: Truck,
    path: "/delivery",
    color: "bg-blue"
  },
  {
    title: "Offers Management",
    description: "Create and manage coupon codes",
    icon: Tag,
    path: "/offers",
    color: "bg-orange"
  },
  {
    title: "Commission & Fees",
    description: "Manage commission and other fees",
    icon: Receipt,
    path: "/commission",
    color: "bg-blue"
  },
];

const DashboardSelector = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/auth/login");
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Mart Logo" className="w-16 h-16" />
            <div>
              <h1 className="text-4xl font-bold text-foreground">Mart Dashboards</h1>
              <p className="text-muted-foreground">Select a dashboard to access</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboards.map((dashboard) => (
            <Link key={dashboard.path} to={dashboard.path}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${dashboard.color} flex items-center justify-center mb-4`}>
                    <dashboard.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>{dashboard.title}</CardTitle>
                  <CardDescription>{dashboard.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm text-primary hover:underline">
                    Access Dashboard →
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSelector;

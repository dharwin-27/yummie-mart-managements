import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package, CheckCircle, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DeliveryOverview = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Delivery Dashboard</h2>
        <p className="text-muted-foreground">
          Monitor delivery operations and partner performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              Currently in transit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Pickup</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">
              Awaiting collection
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">256</div>
            <p className="text-xs text-muted-foreground">
              +18% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Partners</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">
              Online and available
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Active Deliveries</CardTitle>
            <CardDescription>Orders currently in transit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="text-sm font-medium">Order #12345</p>
                  <p className="text-xs text-muted-foreground">Partner: Express Delivery</p>
                  <p className="text-xs text-muted-foreground">ETA: 15 minutes</p>
                </div>
                <Badge variant="secondary">In Transit</Badge>
              </div>
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="text-sm font-medium">Order #12344</p>
                  <p className="text-xs text-muted-foreground">Partner: Fast Track</p>
                  <p className="text-xs text-muted-foreground">ETA: 30 minutes</p>
                </div>
                <Badge variant="secondary">In Transit</Badge>
              </div>
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="text-sm font-medium">Order #12343</p>
                  <p className="text-xs text-muted-foreground">Partner: Quick Ship</p>
                  <p className="text-xs text-muted-foreground">Picked up 5 min ago</p>
                </div>
                <Badge variant="outline">Picked Up</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Order #12342</p>
                  <p className="text-xs text-muted-foreground">Partner: Express Delivery</p>
                  <p className="text-xs text-muted-foreground">Delivered 2 min ago</p>
                </div>
                <Badge className="bg-green-600">Delivered</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Partners Today</CardTitle>
            <CardDescription>Best performing delivery partners</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Express Delivery</p>
                  <p className="text-xs text-muted-foreground">45 deliveries</p>
                </div>
                <span className="text-sm font-bold text-green-600">98.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Fast Track</p>
                  <p className="text-xs text-muted-foreground">38 deliveries</p>
                </div>
                <span className="text-sm font-bold text-green-600">97.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Quick Ship</p>
                  <p className="text-xs text-muted-foreground">32 deliveries</p>
                </div>
                <span className="text-sm font-bold text-green-600">96.8%</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Speed Logistics</p>
                  <p className="text-xs text-muted-foreground">28 deliveries</p>
                </div>
                <span className="text-sm font-bold text-green-600">95.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const DeliveryDashboard = () => {
  return (
    <DashboardLayout title="Delivery Dashboard" navItems={[]}>
      <Routes>
        <Route index element={<DeliveryOverview />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DeliveryDashboard;

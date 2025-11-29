import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, CheckCircle, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const OnboardingOverview = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Onboarding Dashboard</h2>
        <p className="text-muted-foreground">
          Manage seller onboarding and verification processes
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Applications</CardTitle>
            <UserPlus className="h-4 w-4 text-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue">24</div>
            <p className="text-xs text-muted-foreground">
              Pending review
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange">18</div>
            <p className="text-xs text-muted-foreground">
              Under verification
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green">156</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">12</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Onboarding Requests</CardTitle>
          <CardDescription>Latest seller applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="text-sm font-medium">Fresh Produce Store</p>
                <p className="text-xs text-muted-foreground">Submitted 2 hours ago</p>
              </div>
              <Badge variant="secondary">Pending</Badge>
            </div>
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="text-sm font-medium">Organic Foods Ltd</p>
                <p className="text-xs text-muted-foreground">Submitted 5 hours ago</p>
              </div>
              <Badge variant="secondary">In Review</Badge>
            </div>
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="text-sm font-medium">Bakery Delights</p>
                <p className="text-xs text-muted-foreground">Submitted 1 day ago</p>
              </div>
              <Badge variant="secondary">Documents Required</Badge>
            </div>
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="text-sm font-medium">Meat Market Pro</p>
                <p className="text-xs text-muted-foreground">Submitted 2 days ago</p>
              </div>
              <Badge className="bg-green text-white">Approved</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Quick Snacks Co</p>
                <p className="text-xs text-muted-foreground">Submitted 3 days ago</p>
              </div>
              <Badge variant="destructive">Rejected</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const OnboardingDashboard = () => {
  return (
    <DashboardLayout title="Onboarding Dashboard" navItems={[]}>
      <Routes>
        <Route index element={<OnboardingOverview />} />
      </Routes>
    </DashboardLayout>
  );
};

export default OnboardingDashboard;

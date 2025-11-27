import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Unauthorized from "./pages/auth/Unauthorized";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ModeratorDashboard from "./pages/moderator/ModeratorDashboard";
import FinanceDashboard from "./pages/finance/FinanceDashboard";
import OnboardingDashboard from "./pages/onboarding/OnboardingDashboard";
import SupportDashboard from "./pages/support/SupportDashboard";
import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/unauthorized" element={<Unauthorized />} />
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/moderator/*" 
              element={
                <ProtectedRoute allowedRoles={["admin", "moderator"]}>
                  <ModeratorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/finance/*" 
              element={
                <ProtectedRoute allowedRoles={["admin", "finance"]}>
                  <FinanceDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/onboarding/*" 
              element={
                <ProtectedRoute allowedRoles={["admin", "onboarding"]}>
                  <OnboardingDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/support/*" 
              element={
                <ProtectedRoute allowedRoles={["admin", "support"]}>
                  <SupportDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/delivery/*" 
              element={
                <ProtectedRoute allowedRoles={["admin", "delivery"]}>
                  <DeliveryDashboard />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

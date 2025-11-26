import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import logo from "@/assets/logo.ico";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, userRole } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast.error(error.message || "Failed to sign in");
    } else {
      toast.success("Signed in successfully");
      // Navigate based on role after successful login
      setTimeout(() => {
        const roleRoute = getRoleRoute(userRole);
        navigate(roleRoute);
      }, 500);
    }

    setLoading(false);
  };

  const getRoleRoute = (role: string | null) => {
    switch (role) {
      case "admin":
        return "/admin";
      case "moderator":
        return "/moderator";
      case "finance":
        return "/finance";
      case "onboarding":
        return "/onboarding";
      case "support":
        return "/support";
      case "delivery":
        return "/delivery";
      default:
        return "/";
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <img src={logo} alt="Mart Logo" className="w-16 h-16" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@yummiemart.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/auth/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-xs font-semibold mb-2">Demo Credentials:</p>
            <div className="text-xs space-y-1">
              <p>Admin: admin@yummiemart.com / admin123</p>
              <p>Moderator: moderator@yummiemart.com / moderator123</p>
              <p>Finance: finance@yummiemart.com / finance123</p>
              <p>Onboarding: onboarding@yummiemart.com / onboarding123</p>
              <p>Support: support@yummiemart.com / support123</p>
              <p>Delivery: delivery@yummiemart.com / delivery123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
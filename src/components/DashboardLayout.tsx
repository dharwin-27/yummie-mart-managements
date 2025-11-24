import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, Home } from "lucide-react";
import logo from "@/assets/logo.ico";

interface NavItem {
  title: string;
  path: string;
  icon: ReactNode;
}

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  navItems: NavItem[];
}

const DashboardLayout = ({ children, title, navItems }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-card border-r border-border transition-all duration-300 flex flex-col",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        {/* Logo and Toggle */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <img src={logo} alt="Mart" className="w-8 h-8" />
              <span className="font-bold text-foreground">Mart</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2">
          <Link to="/">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start mb-2",
                !sidebarOpen && "justify-center"
              )}
            >
              <Home className="w-4 h-4" />
              {sidebarOpen && <span className="ml-2">Home</span>}
            </Button>
          </Link>
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={location.pathname === item.path ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start mb-2",
                  !sidebarOpen && "justify-center"
                )}
              >
                {item.icon}
                {sidebarOpen && <span className="ml-2">{item.title}</span>}
              </Button>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-card border-b border-border p-4">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;

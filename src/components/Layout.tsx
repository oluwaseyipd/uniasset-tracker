import { NavLink } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Building2,
  Package,
  Wrench,
  FileText,
  LogOut,
} from "lucide-react";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { signOut } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Departments", href: "/departments", icon: Building2 },
    { name: "Assets", href: "/assets", icon: Package },
    { name: "Maintenance", href: "/maintenance", icon: Wrench },
    { name: "Reports", href: "/reports", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <h1 className="text-xl font-bold text-primary">University Asset Management</h1>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    end
                    className={({ isActive }) =>
                      `inline-flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "text-primary border-b-2 border-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`
                    }
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
};

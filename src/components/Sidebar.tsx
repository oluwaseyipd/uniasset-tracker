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
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Departments", href: "/departments", icon: Building2 },
  { name: "Assets", href: "/assets", icon: Package },
  { name: "Maintenance", href: "/maintenance", icon: Wrench },
  { name: "Reports", href: "/reports", icon: FileText },
];

export const Sidebar = () => {
  const { signOut } = useAuth();

  return (
    <div className="hidden md:flex md:flex-col md:w-64 md:border-r md:border-border bg-card">
      <div className="flex flex-col flex-grow pt-5">
        <div className="flex items-center flex-shrink-0 px-4">
          <h1 className="text-xl font-bold text-primary">
            University Asset Management
          </h1>
        </div>
        <div className="mt-5 flex-1 flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-4">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
          <div className="px-2 pb-4">
            <Button variant="destructive" className="w-full" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Header = () => {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between h-16 px-4 border-b border-border bg-card sm:px-6 lg:px-8">
      <div></div>
      <div className="flex items-center">
        <span className="mr-4 text-sm font-medium text-foreground">
          {user?.email}
        </span>
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg" alt="Avatar" />
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

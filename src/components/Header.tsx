import { NavLink } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Building2,
  Package,
  Wrench,
  FileText,
  LogOut,
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Header as AppHeader } from "@/components/Header";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Departments", href: "/departments", icon: Building2 },
  { name: "Assets", href: "/assets", icon: Package },
  { name: "Maintenance", href: "/maintenance", icon: Wrench },
  { name: "Reports", href: "/reports", icon: FileText },
];

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { signOut } = useAuth();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleNavLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar>
        <SidebarContent>
          <div className="flex flex-col h-full pt-5">
            <SidebarHeader>
              <h1 className="text-xl font-bold text-primary">
                University Asset Management
              </h1>
            </SidebarHeader>
            <div className="mt-5 flex-1 flex flex-col min-h-0">
              <nav className="flex-1 px-2 pb-4 space-y-4 overflow-y-auto">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    end
                    onClick={handleNavLinkClick}
                    className={({ isActive }) =>
                      cn(
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )
                    }
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
              <div className="px-2 pb-4 flex-shrink-0">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={signOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </SidebarContent>
      </Sidebar>
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex-shrink-0">
          <AppHeader>
            <SidebarTrigger />
          </AppHeader>
        </div>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
};

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertTriangle, ArrowRightLeft, Wrench } from "lucide-react";

interface Stats {
  total: number;
  missing: number;
  transferred: number;
  inRepair: number;
}

interface DepartmentSummary {
  id: string;
  name: string;
  assetCount: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ total: 0, missing: 0, transferred: 0, inRepair: 0 });
  const [departments, setDepartments] = useState<DepartmentSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch asset stats
      const { data: assets } = await supabase.from("assets").select("status");
      
      if (assets) {
        setStats({
          total: assets.length,
          missing: assets.filter((a) => a.status === "missing").length,
          transferred: assets.filter((a) => a.status === "transferred").length,
          inRepair: assets.filter((a) => a.status === "in_repair").length,
        });
      }

      // Fetch department summary
      const { data: depts } = await supabase
        .from("departments")
        .select("id, name, assets(count)");

      if (depts) {
        const summary = depts.map((dept: any) => ({
          id: dept.id,
          name: dept.name,
          assetCount: dept.assets[0]?.count || 0,
        }));
        setDepartments(summary);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading dashboard...</div>;
  }

  const statCards = [
    { title: "Total Assets", value: stats.total, icon: Package, color: "text-primary" },
    { title: "Missing Assets", value: stats.missing, icon: AlertTriangle, color: "text-destructive" },
    { title: "Transferred", value: stats.transferred, icon: ArrowRightLeft, color: "text-accent" },
    { title: "In Repair", value: stats.inRepair, icon: Wrench, color: "text-secondary" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your asset management system</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assets by Department</CardTitle>
        </CardHeader>
        <CardContent>
          {departments.length === 0 ? (
            <p className="text-muted-foreground">No departments found. Create a department to get started.</p>
          ) : (
            <div className="space-y-4">
              {departments.map((dept) => (
                <div key={dept.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                  <span className="font-medium">{dept.name}</span>
                  <span className="text-2xl font-bold text-primary">{dept.assetCount}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

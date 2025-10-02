import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Printer } from "lucide-react";

interface Asset {
  id: string;
  name: string;
  category: string;
  serial_number: string;
  status: string;
  departments: { name: string } | null;
}

export default function Reports() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const { data, error } = await supabase
        .from("assets")
        .select("*, departments(name)")
        .order("status");

      if (error) throw error;
      setAssets(data || []);
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: "default",
      missing: "destructive",
      transferred: "secondary",
      in_repair: "outline",
    };
    return <Badge variant={variants[status]}>{status.replace("_", " ").toUpperCase()}</Badge>;
  };

  const flaggedAssets = assets.filter(
    (a) => a.status === "missing" || a.status === "transferred" || a.status === "in_repair"
  );

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const csvContent = [
      ["Name", "Category", "Serial Number", "Department", "Status"],
      ...assets.map((asset) => [
        asset.name,
        asset.category,
        asset.serial_number,
        asset.departments?.name || "N/A",
        asset.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `asset-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (loading) {
    return <div className="text-center">Loading reports...</div>;
  }

  const stats = {
    total: assets.length,
    active: assets.filter((a) => a.status === "active").length,
    flagged: flaggedAssets.length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-1">View asset summaries and flagged items</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <FileText className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Flagged Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{stats.flagged}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Flagged Assets</CardTitle>
        </CardHeader>
        <CardContent>
          {flaggedAssets.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No flagged assets</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flaggedAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-medium">{asset.name}</TableCell>
                      <TableCell>{asset.category}</TableCell>
                      <TableCell>{asset.serial_number}</TableCell>
                      <TableCell>{asset.departments?.name || "N/A"}</TableCell>
                      <TableCell>{getStatusBadge(asset.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Assets Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.name}</TableCell>
                    <TableCell>{asset.category}</TableCell>
                    <TableCell>{asset.serial_number}</TableCell>
                    <TableCell>{asset.departments?.name || "N/A"}</TableCell>
                    <TableCell>{getStatusBadge(asset.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

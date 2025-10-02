import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, Search } from "lucide-react";

interface Asset {
  id: string;
  name: string;
  category: string;
  serial_number: string;
  department_id: string | null;
  purchase_date: string;
  status: string;
  departments: { name: string } | null;
}

interface Department {
  id: string;
  name: string;
}

export default function Assets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState<string>("all");
  const [formData, setFormData] = useState<{
    name: string;
    category: string;
    serial_number: string;
    department_id: string;
    purchase_date: string;
    status: "active" | "missing" | "transferred" | "in_repair";
  }>({
    name: "",
    category: "",
    serial_number: "",
    department_id: "",
    purchase_date: "",
    status: "active",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assetsRes, deptsRes] = await Promise.all([
        supabase.from("assets").select("*, departments(name)").order("name"),
        supabase.from("departments").select("id, name").order("name"),
      ]);

      if (assetsRes.error) throw assetsRes.error;
      if (deptsRes.error) throw deptsRes.error;

      setAssets(assetsRes.data || []);
      setDepartments(deptsRes.data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        department_id: formData.department_id || null,
      };

      if (editingAsset) {
        const { error } = await supabase
          .from("assets")
          .update(payload)
          .eq("id", editingAsset.id);

        if (error) throw error;
        toast({ title: "Success", description: "Asset updated successfully" });
      } else {
        const { error } = await supabase.from("assets").insert([payload]);

        if (error) throw error;
        toast({ title: "Success", description: "Asset created successfully" });
      }

      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setFormData({
      name: asset.name,
      category: asset.category,
      serial_number: asset.serial_number,
      department_id: asset.department_id || "",
      purchase_date: asset.purchase_date,
      status: asset.status as "active" | "missing" | "transferred" | "in_repair",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this asset?")) return;

    try {
      const { error } = await supabase.from("assets").delete().eq("id", id);

      if (error) throw error;
      toast({ title: "Success", description: "Asset deleted successfully" });
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      serial_number: "",
      department_id: "",
      purchase_date: "",
      status: "active" as const,
    });
    setEditingAsset(null);
  };

  const resetDialog = () => {
    setDialogOpen(false);
    resetForm();
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

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serial_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === "all" || asset.department_id === filterDept;
    return matchesSearch && matchesDept;
  });

  if (loading) {
    return <div className="text-center">Loading assets...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Assets</h1>
          <p className="text-muted-foreground mt-1">Manage your university assets</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => !open && resetDialog()}>
          <DialogTrigger asChild>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Asset
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingAsset ? "Edit" : "Add"} Asset</DialogTitle>
              <DialogDescription>
                {editingAsset ? "Update" : "Create"} asset information
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Asset Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serial_number">Serial Number</Label>
                <Input
                  id="serial_number"
                  value={formData.serial_number}
                  onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.department_id}
                  onValueChange={(value) => setFormData({ ...formData, department_id: value })}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchase_date">Purchase Date</Label>
                <Input
                  id="purchase_date"
                  type="date"
                  value={formData.purchase_date}
                  onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as "active" | "missing" | "transferred" | "in_repair" })}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="missing">Missing</SelectItem>
                    <SelectItem value="transferred">Transferred</SelectItem>
                    <SelectItem value="in_repair">In Repair</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                {editingAsset ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterDept} onValueChange={setFilterDept}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Purchase Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No assets found
                </TableCell>
              </TableRow>
            ) : (
              filteredAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell>{asset.category}</TableCell>
                  <TableCell>{asset.serial_number}</TableCell>
                  <TableCell>{asset.departments?.name || "N/A"}</TableCell>
                  <TableCell>{new Date(asset.purchase_date).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(asset.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(asset)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(asset.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

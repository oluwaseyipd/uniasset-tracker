import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface MaintenanceRecord {
  id: string;
  asset_id: string;
  maintenance_date: string;
  type: string;
  technician: string;
  remarks: string | null;
  assets: { name: string };
}

interface Asset {
  id: string;
  name: string;
}

export default function Maintenance() {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    asset_id: "",
    maintenance_date: "",
    type: "",
    technician: "",
    remarks: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [recordsRes, assetsRes] = await Promise.all([
        supabase
          .from("maintenance")
          .select("*, assets(name)")
          .order("maintenance_date", { ascending: false }),
        supabase.from("assets").select("id, name").order("name"),
      ]);

      if (recordsRes.error) throw recordsRes.error;
      if (assetsRes.error) throw assetsRes.error;

      setRecords(recordsRes.data || []);
      setAssets(assetsRes.data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase.from("maintenance").insert([formData]);

      if (error) throw error;
      toast({ title: "Success", description: "Maintenance record created successfully" });

      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData({
      asset_id: "",
      maintenance_date: "",
      type: "",
      technician: "",
      remarks: "",
    });
  };

  const resetDialog = () => {
    setDialogOpen(false);
    resetForm();
  };

  if (loading) {
    return <div className="text-center">Loading maintenance records...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Maintenance</h1>
          <p className="text-muted-foreground mt-1">Track asset maintenance history</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => !open && resetDialog()}>
          <DialogTrigger asChild>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Maintenance Record</DialogTitle>
              <DialogDescription>Record maintenance activity for an asset</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="asset">Asset</Label>
                <Select
                  value={formData.asset_id}
                  onValueChange={(value) => setFormData({ ...formData, asset_id: value })}
                  required
                >
                  <SelectTrigger id="asset">
                    <SelectValue placeholder="Select asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {assets.map((asset) => (
                      <SelectItem key={asset.id} value={asset.id}>
                        {asset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maintenance_date">Date</Label>
                <Input
                  id="maintenance_date"
                  type="date"
                  value={formData.maintenance_date}
                  onChange={(e) => setFormData({ ...formData, maintenance_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Input
                  id="type"
                  placeholder="e.g., Repair, Inspection, Cleaning"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="technician">Technician</Label>
                <Input
                  id="technician"
                  placeholder="Technician name"
                  value={formData.technician}
                  onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  placeholder="Additional notes"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full">
                Create Record
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No maintenance records found
                </TableCell>
              </TableRow>
            ) : (
              records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.assets.name}</TableCell>
                  <TableCell>{new Date(record.maintenance_date).toLocaleDateString()}</TableCell>
                  <TableCell>{record.type}</TableCell>
                  <TableCell>{record.technician}</TableCell>
                  <TableCell>{record.remarks || "—"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

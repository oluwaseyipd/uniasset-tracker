import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus } from "lucide-react";
import { ConfirmationModal } from "@/components/ConfirmationModal";

interface Department {
  id: string;
  name: string;
  description: string | null;
}

export default function Departments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState<Department | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const { toast } = useToast();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from("departments")
        .select("*")
        .order("name");

      if (error) throw error;
      setDepartments(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingDept) {
        const { error } = await supabase
          .from("departments")
          .update(formData)
          .eq("id", editingDept.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Department updated successfully",
        });
      } else {
        const { error } = await supabase.from("departments").insert([formData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Department created successfully",
        });
      }

      setDialogOpen(false);
      setFormData({ name: "", description: "" });
      setEditingDept(null);
      fetchDepartments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (dept: Department) => {
    setEditingDept(dept);
    setFormData({ name: dept.name, description: dept.description || "" });
    setDialogOpen(true);
  };

  const handleDeleteClick = (dept: Department) => {
    setDeptToDelete(dept);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deptToDelete) return;

    setDeleteLoading(true);
    try {
      const { error } = await supabase
        .from("departments")
        .delete()
        .eq("id", deptToDelete.id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Department deleted successfully",
      });
      fetchDepartments();
      setDeptToDelete(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const resetDialog = () => {
    setDialogOpen(false);
    setEditingDept(null);
    setFormData({ name: "", description: "" });
  };

  if (loading) {
    return <div className="text-center">Loading departments...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Departments</h1>
          <p className="text-muted-foreground mt-1">
            Manage your university departments
          </p>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => !open && resetDialog()}
        >
          <DialogTrigger asChild>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDept ? "Edit" : "Add"} Department
              </DialogTitle>
              <DialogDescription>
                {editingDept ? "Update" : "Create"} department information
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Department Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingDept ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {departments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No departments yet. Create your first department to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => (
            <Card key={dept.id}>
              <CardHeader>
                <CardTitle>{dept.name}</CardTitle>
                {dept.description && (
                  <CardDescription>{dept.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(dept)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(dept)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Department"
        description={
          deptToDelete
            ? `Are you sure you want to delete "${deptToDelete.name}"? This action cannot be undone and will remove the department from all associated assets.`
            : ""
        }
        onConfirm={handleDeleteConfirm}
        confirmText="Delete Department"
        loading={deleteLoading}
        type="delete"
      />
    </div>
  );
}

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Plus, DollarSign, FileText, TrendingUp, AlertCircle } from "lucide-react";

const CommissionFees = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    fee_type: "",
    amount: "",
    invoice_number: "",
    description: "",
    party_name: "",
    status: "pending" as "pending" | "paid" | "cancelled",
    due_date: "",
    paid_date: "",
  });

  const { data: fees, isLoading } = useQuery({
    queryKey: ["commission-fees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("commission_fees")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const stats = fees?.reduce(
    (acc, fee) => {
      if (fee.status === "pending") {
        acc.pending += fee.amount;
        acc.pendingCount += 1;
      } else if (fee.status === "paid") {
        acc.paid += fee.amount;
        acc.paidCount += 1;
      }
      acc.total += fee.amount;
      return acc;
    },
    { pending: 0, paid: 0, total: 0, pendingCount: 0, paidCount: 0 }
  ) || { pending: 0, paid: 0, total: 0, pendingCount: 0, paidCount: 0 };

  const createFeeMutation = useMutation({
    mutationFn: async (newFee: any) => {
      const { data, error } = await supabase
        .from("commission_fees")
        .insert([newFee])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commission-fees"] });
      toast.success("Fee record created successfully!");
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to create fee: " + error.message);
    },
  });

  const updateFeeMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from("commission_fees")
        .update(updates)
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commission-fees"] });
      toast.success("Fee record updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update fee: " + error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      fee_type: "",
      amount: "",
      invoice_number: "",
      description: "",
      party_name: "",
      status: "pending",
      due_date: "",
      paid_date: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to create fee records");
      return;
    }

    const feeData = {
      fee_type: formData.fee_type,
      amount: parseFloat(formData.amount),
      invoice_number: formData.invoice_number || null,
      description: formData.description || null,
      party_name: formData.party_name,
      status: formData.status,
      due_date: formData.due_date || null,
      paid_date: formData.paid_date || null,
      created_by: user.id,
    };

    createFeeMutation.mutate(feeData);
  };

  const handleUpdateStatus = (fee: any, newStatus: "pending" | "paid" | "cancelled") => {
    const updates: any = { status: newStatus };
    if (newStatus === "paid" && !fee.paid_date) {
      updates.paid_date = new Date().toISOString().split('T')[0];
    }
    updateFeeMutation.mutate({ id: fee.id, updates });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green text-white">Paid</Badge>;
      case "pending":
        return <Badge className="bg-orange text-white">Pending</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Commission & Other Fees</h2>
          <p className="text-muted-foreground mt-1">Track and manage invoices and payments</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Fee Record
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Fee Record</DialogTitle>
              <DialogDescription>Add a new commission or fee entry</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fee_type">Fee Type *</Label>
                  <Input
                    id="fee_type"
                    value={formData.fee_type}
                    onChange={(e) => setFormData({ ...formData, fee_type: e.target.value })}
                    placeholder="e.g., Commission, Platform Fee"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="1000.00"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="party_name">Party Name *</Label>
                  <Input
                    id="party_name"
                    value={formData.party_name}
                    onChange={(e) => setFormData({ ...formData, party_name: e.target.value })}
                    placeholder="Company/Individual Name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoice_number">Invoice Number</Label>
                  <Input
                    id="invoice_number"
                    value={formData.invoice_number}
                    onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                    placeholder="INV-2024-001"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional details about this fee..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "pending" | "paid" | "cancelled") => 
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paid_date">Paid Date</Label>
                  <Input
                    id="paid_date"
                    type="date"
                    value={formData.paid_date}
                    onChange={(e) => setFormData({ ...formData, paid_date: e.target.value })}
                    disabled={formData.status !== "paid"}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createFeeMutation.isPending}>
                  {createFeeMutation.isPending ? "Creating..." : "Create Record"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.total.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time total</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.pending.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{stats.pendingCount} pending payments</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <TrendingUp className="h-4 w-4 text-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.paid.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{stats.paidCount} completed payments</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invoices</CardTitle>
            <FileText className="h-4 w-4 text-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fees?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Total records</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fee Records</CardTitle>
          <CardDescription>All commission and fee transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading fee records...</div>
          ) : fees && fees.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Fee Type</TableHead>
                  <TableHead>Party Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fees.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell className="font-mono">{fee.invoice_number || "-"}</TableCell>
                    <TableCell className="font-medium">{fee.fee_type}</TableCell>
                    <TableCell>{fee.party_name}</TableCell>
                    <TableCell className="font-semibold">₹{fee.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      {fee.due_date ? new Date(fee.due_date).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell>{getStatusBadge(fee.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {fee.status === "pending" && (
                          <Button
                            size="sm"
                            variant="default"
                            className="bg-green hover:bg-green/90"
                            onClick={() => handleUpdateStatus(fee, "paid")}
                          >
                            Mark Paid
                          </Button>
                        )}
                        {fee.status === "paid" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(fee, "pending")}
                          >
                            Mark Pending
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No fee records found. Add your first record to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommissionFees;
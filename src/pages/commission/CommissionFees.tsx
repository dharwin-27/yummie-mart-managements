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
import { Plus } from "lucide-react";

type FeeStatus = "pending" | "paid" | "cancelled";

const CommissionFees = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    party_name: "",
    fee_type: "",
    amount: "",
    invoice_number: "",
    description: "",
    due_date: "",
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
      setFormData({
        party_name: "",
        fee_type: "",
        amount: "",
        invoice_number: "",
        description: "",
        due_date: "",
      });
    },
    onError: (error) => {
      toast.error("Failed to create fee record: " + error.message);
    },
  });

  const updateFeeStatusMutation = useMutation({
    mutationFn: async ({ id, status, paid_date }: { id: string; status: FeeStatus; paid_date?: string }) => {
      const updateData: any = { status };
      if (status === "paid" && paid_date) {
        updateData.paid_date = paid_date;
      }
      
      const { error } = await supabase
        .from("commission_fees")
        .update(updateData)
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commission-fees"] });
      toast.success("Fee status updated!");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to create fee records");
      return;
    }

    const feeData = {
      party_name: formData.party_name,
      fee_type: formData.fee_type,
      amount: parseFloat(formData.amount),
      invoice_number: formData.invoice_number || null,
      description: formData.description || null,
      due_date: formData.due_date || null,
      created_by: user.id,
      status: "pending" as FeeStatus,
    };

    createFeeMutation.mutate(feeData);
  };

  const getStatusBadge = (status: FeeStatus) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green text-white">Paid</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Commission & Other Fees</h2>
          <p className="text-muted-foreground mt-1">Manage commission fees and other payments</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Fee Record
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Fee Record</DialogTitle>
              <DialogDescription>Fill in the details to create a new fee record</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="party_name">Party Name *</Label>
                  <Input
                    id="party_name"
                    value={formData.party_name}
                    onChange={(e) => setFormData({ ...formData, party_name: e.target.value })}
                    placeholder="e.g., Seller Name or Partner Name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fee_type">Fee Type *</Label>
                  <Input
                    id="fee_type"
                    value={formData.fee_type}
                    onChange={(e) => setFormData({ ...formData, fee_type: e.target.value })}
                    placeholder="e.g., Commission, Service Fee"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="1000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoice_number">Invoice Number</Label>
                  <Input
                    id="invoice_number"
                    value={formData.invoice_number}
                    onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                    placeholder="INV-001"
                  />
                </div>
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional details about this fee..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createFeeMutation.isPending}>
                  {createFeeMutation.isPending ? "Creating..." : "Create Fee Record"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fee Records</CardTitle>
          <CardDescription>All commission and fee records</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading fee records...</div>
          ) : fees && fees.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Party Name</TableHead>
                  <TableHead>Fee Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fees.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell className="font-medium">{fee.party_name}</TableCell>
                    <TableCell>{fee.fee_type}</TableCell>
                    <TableCell>₹{fee.amount.toFixed(2)}</TableCell>
                    <TableCell>{fee.invoice_number || "-"}</TableCell>
                    <TableCell>
                      {fee.due_date ? new Date(fee.due_date).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell>{getStatusBadge(fee.status as FeeStatus)}</TableCell>
                    <TableCell>
                      {fee.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => 
                              updateFeeStatusMutation.mutate({ 
                                id: fee.id, 
                                status: "paid",
                                paid_date: new Date().toISOString().split('T')[0]
                              })
                            }
                          >
                            Mark Paid
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => 
                              updateFeeStatusMutation.mutate({ 
                                id: fee.id, 
                                status: "cancelled"
                              })
                            }
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                      {fee.status === "paid" && (
                        <span className="text-sm text-muted-foreground">
                          Paid on {fee.paid_date ? new Date(fee.paid_date).toLocaleDateString() : "-"}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No fee records found. Create your first record to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommissionFees;

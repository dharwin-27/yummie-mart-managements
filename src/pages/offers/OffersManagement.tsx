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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Plus, Users, User } from "lucide-react";

const OffersManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUsageOpen, setIsUsageOpen] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage" as "percentage" | "fixed",
    discount_value: "",
    coupon_type: "public" as "public" | "individual",
    individual_user_name: "",
    individual_user_mobile: "",
    min_order_value: "",
    max_uses: "",
    expires_at: "",
  });

  const { data: coupons, isLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: couponUsage } = useQuery({
    queryKey: ["coupon-usage", selectedCouponId],
    queryFn: async () => {
      if (!selectedCouponId) return [];
      const { data, error } = await supabase
        .from("coupon_usage")
        .select("*")
        .eq("coupon_id", selectedCouponId)
        .order("used_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedCouponId,
  });

  const createCouponMutation = useMutation({
    mutationFn: async (newCoupon: any) => {
      const { data, error } = await supabase
        .from("coupons")
        .insert([newCoupon])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success("Coupon created successfully!");
      setIsCreateOpen(false);
      setFormData({
        code: "",
        discount_type: "percentage",
        discount_value: "",
        coupon_type: "public",
        individual_user_name: "",
        individual_user_mobile: "",
        min_order_value: "",
        max_uses: "",
        expires_at: "",
      });
    },
    onError: (error) => {
      toast.error("Failed to create coupon: " + error.message);
    },
  });

  const toggleCouponMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("coupons")
        .update({ is_active })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success("Coupon status updated!");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to create coupons");
      return;
    }

    const couponData = {
      code: formData.code.toUpperCase(),
      discount_type: formData.discount_type,
      discount_value: parseFloat(formData.discount_value),
      coupon_type: formData.coupon_type,
      min_order_value: formData.min_order_value ? parseFloat(formData.min_order_value) : 0,
      max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
      expires_at: formData.expires_at || null,
      created_by: user.id,
      ...(formData.coupon_type === "individual" && {
        individual_user_name: formData.individual_user_name,
        individual_user_mobile: formData.individual_user_mobile,
      }),
    };

    createCouponMutation.mutate(couponData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Coupon Codes Management</h2>
          <p className="text-muted-foreground mt-1">Create and manage discount coupons</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
              <DialogDescription>Fill in the details to create a new coupon code</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Coupon Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., YM50"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="coupon_type">Coupon Type *</Label>
                  <Select
                    value={formData.coupon_type}
                    onValueChange={(value: "public" | "individual") => 
                      setFormData({ ...formData, coupon_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public (Anyone)</SelectItem>
                      <SelectItem value="individual">Individual (Specific User)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.coupon_type === "individual" && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-accent/50 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="individual_user_name">User Name *</Label>
                    <Input
                      id="individual_user_name"
                      value={formData.individual_user_name}
                      onChange={(e) => setFormData({ ...formData, individual_user_name: e.target.value })}
                      required={formData.coupon_type === "individual"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="individual_user_mobile">Mobile Number *</Label>
                    <Input
                      id="individual_user_mobile"
                      value={formData.individual_user_mobile}
                      onChange={(e) => setFormData({ ...formData, individual_user_mobile: e.target.value })}
                      placeholder="+91 XXXXXXXXXX"
                      required={formData.coupon_type === "individual"}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount_type">Discount Type *</Label>
                  <Select
                    value={formData.discount_type}
                    onValueChange={(value: "percentage" | "fixed") => 
                      setFormData({ ...formData, discount_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount_value">
                    Discount Value * {formData.discount_type === "percentage" ? "(%)" : "(₹)"}
                  </Label>
                  <Input
                    id="discount_value"
                    type="number"
                    step="0.01"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                    placeholder={formData.discount_type === "percentage" ? "50" : "100"}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_order_value">Min Order Value (₹)</Label>
                  <Input
                    id="min_order_value"
                    type="number"
                    step="0.01"
                    value={formData.min_order_value}
                    onChange={(e) => setFormData({ ...formData, min_order_value: e.target.value })}
                    placeholder="500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_uses">Max Uses (optional)</Label>
                  <Input
                    id="max_uses"
                    type="number"
                    value={formData.max_uses}
                    onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                    placeholder="Leave empty for unlimited"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expires_at">Expiry Date (optional)</Label>
                <Input
                  id="expires_at"
                  type="datetime-local"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createCouponMutation.isPending}>
                  {createCouponMutation.isPending ? "Creating..." : "Create Coupon"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Coupons</CardTitle>
          <CardDescription>Manage all coupon codes</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading coupons...</div>
          ) : coupons && coupons.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Min Order</TableHead>
                  <TableHead>User Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell className="font-mono font-semibold">{coupon.code}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1">
                        {coupon.coupon_type === "public" ? (
                          <>
                            <Users className="h-3 w-3" />
                            Public
                          </>
                        ) : (
                          <>
                            <User className="h-3 w-3" />
                            Individual
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {coupon.discount_type === "percentage" 
                        ? `${coupon.discount_value}%` 
                        : `₹${coupon.discount_value}`}
                    </TableCell>
                    <TableCell>₹{coupon.min_order_value}</TableCell>
                    <TableCell>
                      {coupon.coupon_type === "individual" ? (
                        <div className="text-sm">
                          <div className="font-medium">{coupon.individual_user_name}</div>
                          <div className="text-muted-foreground">{coupon.individual_user_mobile}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {coupon.is_active ? (
                        <Badge className="bg-green text-white">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedCouponId(coupon.id);
                            setIsUsageOpen(true);
                          }}
                        >
                          View Usage
                        </Button>
                        <Button
                          size="sm"
                          variant={coupon.is_active ? "destructive" : "default"}
                          onClick={() => 
                            toggleCouponMutation.mutate({ 
                              id: coupon.id, 
                              is_active: !coupon.is_active 
                            })
                          }
                        >
                          {coupon.is_active ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No coupons found. Create your first coupon to get started.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isUsageOpen} onOpenChange={setIsUsageOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Coupon Usage History</DialogTitle>
            <DialogDescription>View who has used this coupon</DialogDescription>
          </DialogHeader>
          {couponUsage && couponUsage.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Name</TableHead>
                  <TableHead>Mobile Number</TableHead>
                  <TableHead>Order Value</TableHead>
                  <TableHead>Used At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {couponUsage.map((usage) => (
                  <TableRow key={usage.id}>
                    <TableCell className="font-medium">{usage.user_name}</TableCell>
                    <TableCell>{usage.user_mobile}</TableCell>
                    <TableCell>₹{usage.order_value}</TableCell>
                    <TableCell>{new Date(usage.used_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              This coupon hasn't been used yet.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OffersManagement;

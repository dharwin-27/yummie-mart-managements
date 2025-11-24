import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Eye, Ban, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "suspended" | "pending";
  joinedDate: string;
  totalProducts: number;
  totalSales: number;
  businessName?: string;
  gstNumber?: string;
  panNumber?: string;
  aadharNumber?: string;
  businessAddress?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
}

const SellerManagement = () => {
  const [sellers, setSellers] = useState<Seller[]>([
    {
      id: "S001",
      name: "Tech Store",
      email: "tech@store.com",
      phone: "+1234567890",
      status: "active",
      joinedDate: "2024-01-15",
      totalProducts: 45,
      totalSales: 12500
    },
    {
      id: "S002",
      name: "Fashion Hub",
      email: "fashion@hub.com",
      phone: "+1234567891",
      status: "active",
      joinedDate: "2024-02-20",
      totalProducts: 120,
      totalSales: 25000
    },
    {
      id: "S003",
      name: "Home Goods",
      email: "home@goods.com",
      phone: "+1234567892",
      status: "pending",
      joinedDate: "2024-11-10",
      totalProducts: 15,
      totalSales: 0
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const handleStatusChange = (sellerId: string, newStatus: "active" | "suspended") => {
    setSellers(sellers.map(s => 
      s.id === sellerId ? { ...s, status: newStatus } : s
    ));
    toast.success(`Seller status updated to ${newStatus}`);
  };

  const filteredSellers = sellers.filter(seller =>
    seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Seller Management</h2>
          <p className="text-muted-foreground">Manage and monitor all sellers</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-orange hover:bg-orange-dark">
              <Plus className="w-4 h-4 mr-2" />
              Add Seller
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Seller with KYC Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Basic Information</h3>
                <div>
                  <Label>Seller Name</Label>
                  <Input placeholder="Enter seller name" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" placeholder="seller@email.com" />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input placeholder="+1234567890" />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <h3 className="font-semibold text-sm">Business KYC Details</h3>
                <div>
                  <Label>Business Name</Label>
                  <Input placeholder="Enter business name" />
                </div>
                <div>
                  <Label>GST Number</Label>
                  <Input placeholder="Enter GST number" />
                </div>
                <div>
                  <Label>PAN Number</Label>
                  <Input placeholder="Enter PAN number" />
                </div>
                <div>
                  <Label>Aadhar Number</Label>
                  <Input placeholder="Enter Aadhar number" />
                </div>
                <div>
                  <Label>Business Address</Label>
                  <Input placeholder="Enter complete business address" />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <h3 className="font-semibold text-sm">Bank Details</h3>
                <div>
                  <Label>Bank Account Number</Label>
                  <Input placeholder="Enter bank account number" />
                </div>
                <div>
                  <Label>IFSC Code</Label>
                  <Input placeholder="Enter IFSC code" />
                </div>
              </div>

              <Button className="w-full bg-orange hover:bg-orange-dark">Add Seller</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Sellers</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search sellers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Seller ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSellers.map((seller) => (
                <TableRow key={seller.id}>
                  <TableCell className="font-medium">{seller.id}</TableCell>
                  <TableCell>{seller.name}</TableCell>
                  <TableCell>{seller.email}</TableCell>
                  <TableCell>{seller.phone}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        seller.status === "active" ? "default" :
                        seller.status === "suspended" ? "destructive" : "secondary"
                      }
                    >
                      {seller.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{seller.totalProducts}</TableCell>
                  <TableCell>${seller.totalSales.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {seller.status !== "active" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStatusChange(seller.id, "active")}
                        >
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </Button>
                      )}
                      {seller.status === "active" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStatusChange(seller.id, "suspended")}
                        >
                          <Ban className="w-4 h-4 text-red-600" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerManagement;

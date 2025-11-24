import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, CheckCircle, XCircle, Eye } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  seller: string;
  category: string;
  price: number;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
}

const ProductModeration = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "P001",
      name: "Wireless Headphones",
      seller: "Tech Store",
      category: "Electronics",
      price: 99.99,
      status: "pending",
      submittedDate: "2024-11-14"
    },
    {
      id: "P002",
      name: "Running Shoes",
      seller: "Fashion Hub",
      category: "Footwear",
      price: 79.99,
      status: "approved",
      submittedDate: "2024-11-12"
    },
    {
      id: "P003",
      name: "Coffee Maker",
      seller: "Home Goods",
      category: "Appliances",
      price: 149.99,
      status: "pending",
      submittedDate: "2024-11-15"
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = (productId: string) => {
    setProducts(products.map(p =>
      p.id === productId ? { ...p, status: "approved" as const } : p
    ));
    toast.success("Product approved successfully");
  };

  const handleReject = (productId: string, reason: string) => {
    setProducts(products.map(p =>
      p.id === productId ? { ...p, status: "rejected" as const } : p
    ));
    toast.success("Product rejected");
    setRejectionReason("");
    setSelectedProduct(null);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.seller.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Product Moderation</h2>
        <p className="text-muted-foreground">Review and approve product listings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange">
              {products.filter(p => p.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {products.filter(p => p.status === "approved").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {products.filter(p => p.status === "rejected").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Listings</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search products..."
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
                <TableHead>Product ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.seller}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === "approved" ? "default" :
                        product.status === "rejected" ? "destructive" : "secondary"
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.submittedDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {product.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleApprove(product.id)}
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedProduct(product)}
                              >
                                <XCircle className="w-4 h-4 text-red-600" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reject Product</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <Textarea
                                  placeholder="Enter rejection reason..."
                                  value={rejectionReason}
                                  onChange={(e) => setRejectionReason(e.target.value)}
                                />
                                <Button
                                  className="w-full bg-red-600 hover:bg-red-700"
                                  onClick={() =>
                                    selectedProduct && handleReject(selectedProduct.id, rejectionReason)
                                  }
                                >
                                  Reject Product
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </>
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

export default ProductModeration;

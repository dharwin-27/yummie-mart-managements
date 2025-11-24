import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Eye, CheckCircle, XCircle, Package } from "lucide-react";
import { toast } from "sonner";

interface ProductSubmission {
  id: string;
  seller: string;
  productName: string;
  category: string;
  price: number;
  quantity: number;
  submissionType: "single" | "bulk";
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
  description: string;
  imageCount: number;
}

const SellerProductListReview = () => {
  const [products, setProducts] = useState<ProductSubmission[]>([
    {
      id: "PRD001",
      seller: "Tech Store",
      productName: "Wireless Mouse",
      category: "Electronics",
      price: 29.99,
      quantity: 100,
      submissionType: "single",
      status: "pending",
      submittedDate: "2024-11-18",
      description: "Ergonomic wireless mouse with adjustable DPI",
      imageCount: 4
    },
    {
      id: "PRD002",
      seller: "Fashion Hub",
      productName: "Summer Collection 2024",
      category: "Clothing",
      price: 0,
      quantity: 50,
      submissionType: "bulk",
      status: "pending",
      submittedDate: "2024-11-17",
      description: "Bulk upload of 50 summer clothing items",
      imageCount: 150
    },
    {
      id: "PRD003",
      seller: "Home Goods",
      productName: "LED Desk Lamp",
      category: "Home & Living",
      price: 45.99,
      quantity: 75,
      submissionType: "single",
      status: "approved",
      submittedDate: "2024-11-16",
      description: "Adjustable LED desk lamp with USB charging",
      imageCount: 5
    },
    {
      id: "PRD004",
      seller: "Tech Store",
      productName: "Gaming Accessories Bundle",
      category: "Electronics",
      price: 0,
      quantity: 25,
      submissionType: "bulk",
      status: "pending",
      submittedDate: "2024-11-15",
      description: "Bulk upload of 25 gaming accessories",
      imageCount: 75
    },
    {
      id: "PRD005",
      seller: "Fashion Hub",
      productName: "Leather Wallet",
      category: "Accessories",
      price: 34.99,
      quantity: 150,
      submissionType: "single",
      status: "rejected",
      submittedDate: "2024-11-14",
      description: "Premium leather wallet with RFID protection",
      imageCount: 6
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductSubmission | null>(null);
  const [selectedForBulkAction, setSelectedForBulkAction] = useState<string[]>([]);

  const handleApprove = (productId: string) => {
    setProducts(products.map(p =>
      p.id === productId ? { ...p, status: "approved" as const } : p
    ));
    toast.success("Product approved and published to customer site");
  };

  const handleReject = (productId: string) => {
    setProducts(products.map(p =>
      p.id === productId ? { ...p, status: "rejected" as const } : p
    ));
    toast.success("Product rejected");
  };

  const handleBulkApprove = () => {
    setProducts(products.map(p =>
      selectedForBulkAction.includes(p.id) ? { ...p, status: "approved" as const } : p
    ));
    toast.success(`${selectedForBulkAction.length} products approved`);
    setSelectedForBulkAction([]);
  };

  const handleBulkReject = () => {
    setProducts(products.map(p =>
      selectedForBulkAction.includes(p.id) ? { ...p, status: "rejected" as const } : p
    ));
    toast.success(`${selectedForBulkAction.length} products rejected`);
    setSelectedForBulkAction([]);
  };

  const toggleSelectProduct = (productId: string) => {
    setSelectedForBulkAction(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedForBulkAction.length === filteredProducts.length) {
      setSelectedForBulkAction([]);
    } else {
      setSelectedForBulkAction(filteredProducts.map(p => p.id));
    }
  };

  const filteredProducts = products.filter(product =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Seller Product List Review</h2>
        <p className="text-muted-foreground">Review seller product submissions before publishing to customer site</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Bulk Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue">
              {products.filter(p => p.submissionType === "bulk").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedForBulkAction.length > 0 && (
        <Card className="border-blue">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="font-medium">
                {selectedForBulkAction.length} product(s) selected
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleBulkApprove}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Selected
                </Button>
                <Button
                  onClick={handleBulkReject}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Product Submissions</CardTitle>
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
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedForBulkAction.length === filteredProducts.length && filteredProducts.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Product ID</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Images</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedForBulkAction.includes(product.id)}
                      onCheckedChange={() => toggleSelectProduct(product.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>{product.seller}</TableCell>
                  <TableCell>{product.productName}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <Badge variant={product.submissionType === "bulk" ? "default" : "secondary"}>
                      {product.submissionType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {product.submissionType === "bulk" ? "Varies" : `$${product.price.toFixed(2)}`}
                  </TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.imageCount}</TableCell>
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedProduct(product)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Product Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Product Name</p>
                              <p className="font-medium">{selectedProduct?.productName}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Seller</p>
                              <p className="font-medium">{selectedProduct?.seller}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Submission Type</p>
                              <Badge variant={selectedProduct?.submissionType === "bulk" ? "default" : "secondary"}>
                                {selectedProduct?.submissionType}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Description</p>
                              <p>{selectedProduct?.description}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Category</p>
                              <p>{selectedProduct?.category}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Price</p>
                                <p className="font-medium">
                                  {selectedProduct?.submissionType === "bulk" 
                                    ? "Varies" 
                                    : `$${selectedProduct?.price.toFixed(2)}`}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Quantity</p>
                                <p className="font-medium">{selectedProduct?.quantity}</p>
                              </div>
                            </div>
                            <div className="flex gap-2 pt-4">
                              <Button
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                onClick={() => selectedProduct && handleApprove(selectedProduct.id)}
                              >
                                Approve & Publish
                              </Button>
                              <Button
                                className="flex-1 bg-red-600 hover:bg-red-700"
                                onClick={() => selectedProduct && handleReject(selectedProduct.id)}
                              >
                                Reject
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      {product.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleApprove(product.id)}
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleReject(product.id)}
                          >
                            <XCircle className="w-4 h-4 text-red-600" />
                          </Button>
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

export default SellerProductListReview;
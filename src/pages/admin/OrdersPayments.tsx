import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Eye, Download } from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: string;
  customer: string;
  seller: string;
  amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "paid" | "pending" | "refunded";
  date: string;
}

interface BOQRequest {
  id: string;
  customer: string;
  seller: string;
  productName: string;
  quantity: number;
  requestDate: string;
  status: "pending_seller" | "seller_quoted" | "accepted" | "rejected";
  sellerQuote?: number;
  customerResponse?: "accepted" | "rejected";
  responseDate?: string;
}

const OrdersPayments = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD001",
      customer: "John Doe",
      seller: "Tech Store",
      amount: 299.99,
      status: "delivered",
      paymentStatus: "paid",
      date: "2024-11-10"
    },
    {
      id: "ORD002",
      customer: "Jane Smith",
      seller: "Fashion Hub",
      amount: 159.99,
      status: "shipped",
      paymentStatus: "paid",
      date: "2024-11-13"
    },
    {
      id: "ORD003",
      customer: "Bob Johnson",
      seller: "Home Goods",
      amount: 449.99,
      status: "processing",
      paymentStatus: "paid",
      date: "2024-11-15"
    },
  ]);

  const [boqRequests, setBOQRequests] = useState<BOQRequest[]>([
    {
      id: "BOQ001",
      customer: "ABC Corporation",
      seller: "Tech Store",
      productName: "Wireless Mouse",
      quantity: 500,
      requestDate: "2024-11-18",
      status: "pending_seller"
    },
    {
      id: "BOQ002",
      customer: "XYZ Ltd",
      seller: "Fashion Hub",
      productName: "Corporate T-Shirts",
      quantity: 1000,
      requestDate: "2024-11-17",
      status: "seller_quoted",
      sellerQuote: 15000
    },
    {
      id: "BOQ003",
      customer: "123 Enterprises",
      seller: "Home Goods",
      productName: "Office Chairs",
      quantity: 50,
      requestDate: "2024-11-16",
      status: "accepted",
      sellerQuote: 25000,
      customerResponse: "accepted",
      responseDate: "2024-11-19"
    },
    {
      id: "BOQ004",
      customer: "Global Trading Co",
      seller: "Tech Store",
      productName: "Keyboards",
      quantity: 200,
      requestDate: "2024-11-15",
      status: "rejected",
      sellerQuote: 8000,
      customerResponse: "rejected",
      responseDate: "2024-11-18"
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [boqSearchTerm, setBOQSearchTerm] = useState("");
  const [boqStatusFilter, setBOQStatusFilter] = useState("all");

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrders(orders.map(o =>
      o.id === orderId ? { ...o, status: newStatus } : o
    ));
    toast.success("Order status updated");
  };

  const handleExport = () => {
    toast.success("Orders exported successfully");
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.seller.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredBOQRequests = boqRequests.filter(boq => {
    const matchesSearch = boq.id.toLowerCase().includes(boqSearchTerm.toLowerCase()) ||
      boq.customer.toLowerCase().includes(boqSearchTerm.toLowerCase()) ||
      boq.seller.toLowerCase().includes(boqSearchTerm.toLowerCase()) ||
      boq.productName.toLowerCase().includes(boqSearchTerm.toLowerCase());
    const matchesStatus = boqStatusFilter === "all" || boq.status === boqStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders.reduce((sum, order) => 
    order.paymentStatus === "paid" ? sum + order.amount : sum, 0
  );

  const getStatusBadgeVariant = (status: BOQRequest["status"]) => {
    switch (status) {
      case "pending_seller":
        return "secondary";
      case "seller_quoted":
        return "default";
      case "accepted":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: BOQRequest["status"]) => {
    switch (status) {
      case "pending_seller":
        return "Pending Seller Quote";
      case "seller_quoted":
        return "Seller Quoted";
      case "accepted":
        return "Accepted";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Orders & Payments</h2>
          <p className="text-muted-foreground">Manage orders and track payments</p>
        </div>
        <Button onClick={handleExport} className="bg-blue hover:bg-blue-dark">
          <Download className="w-4 h-4 mr-2" />
          Export Orders
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {orders.filter(o => o.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {orders.filter(o => o.status === "delivered").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="boq">BOQ (Bulk Order Status)</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Orders</CardTitle>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Order Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.seller}</TableCell>
                      <TableCell>${order.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order.id, value as Order["status"])}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.paymentStatus === "paid" ? "default" :
                            order.paymentStatus === "refunded" ? "destructive" : "secondary"
                          }
                        >
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="boq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Order Quotations (BOQ)</CardTitle>
              <p className="text-sm text-muted-foreground">
                Track bulk order requests, seller quotes, and customer responses as intermediator
              </p>
              <div className="flex gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search BOQ requests..."
                    value={boqSearchTerm}
                    onChange={(e) => setBOQSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={boqStatusFilter} onValueChange={setBOQStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending_seller">Pending Seller</SelectItem>
                    <SelectItem value="seller_quoted">Seller Quoted</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Total BOQ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange">{boqRequests.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Pending Quotes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue">
                      {boqRequests.filter(b => b.status === "pending_seller").length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Accepted</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {boqRequests.filter(b => b.status === "accepted").length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Rejected</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {boqRequests.filter(b => b.status === "rejected").length}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>BOQ ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Seller Quote</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Customer Response</TableHead>
                    <TableHead>Response Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBOQRequests.map((boq) => (
                    <TableRow key={boq.id}>
                      <TableCell className="font-medium">{boq.id}</TableCell>
                      <TableCell>{boq.customer}</TableCell>
                      <TableCell>{boq.seller}</TableCell>
                      <TableCell>{boq.productName}</TableCell>
                      <TableCell>{boq.quantity}</TableCell>
                      <TableCell>{boq.requestDate}</TableCell>
                      <TableCell>
                        {boq.sellerQuote ? `$${boq.sellerQuote.toLocaleString()}` : "Pending"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(boq.status)}>
                          {getStatusLabel(boq.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {boq.customerResponse ? (
                          <Badge variant={boq.customerResponse === "accepted" ? "default" : "destructive"}>
                            {boq.customerResponse}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{boq.responseDate || "-"}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrdersPayments;
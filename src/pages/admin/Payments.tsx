import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";

interface Payment {
  id: string;
  seller: string;
  amount: number;
  type: "payout" | "refund" | "commission";
  status: "completed" | "pending" | "failed";
  method: string;
  date: string;
}

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: "PAY001",
      seller: "Tech Store",
      amount: 2500.00,
      type: "payout",
      status: "completed",
      method: "Bank Transfer",
      date: "2024-11-10"
    },
    {
      id: "PAY002",
      seller: "Fashion Hub",
      amount: 3200.00,
      type: "payout",
      status: "completed",
      method: "PayPal",
      date: "2024-11-12"
    },
    {
      id: "PAY003",
      seller: "Home Goods",
      amount: 150.00,
      type: "refund",
      status: "pending",
      method: "Credit Card",
      date: "2024-11-14"
    },
    {
      id: "PAY004",
      seller: "Tech Store",
      amount: 450.00,
      type: "commission",
      status: "completed",
      method: "Platform Fee",
      date: "2024-11-13"
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const handleExport = () => {
    toast.success("Payment report exported successfully");
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.seller.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || payment.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalPayouts = payments
    .filter(p => p.type === "payout" && p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalCommissions = payments
    .filter(p => p.type === "commission" && p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayouts = payments
    .filter(p => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Payments</h2>
          <p className="text-muted-foreground">Manage payouts and financial transactions</p>
        </div>
        <Button onClick={handleExport} className="bg-orange hover:bg-orange-dark">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              ${totalPayouts.toLocaleString()}
            </div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12.5%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Platform Commissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue">
              ${totalCommissions.toLocaleString()}
            </div>
            <div className="flex items-center text-sm text-blue mt-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              +8.3%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pending Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange">
              ${pendingPayouts.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Failed Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {payments.filter(p => p.status === "failed").length}
            </div>
            <div className="flex items-center text-sm text-red-600 mt-1">
              <TrendingDown className="w-4 h-4 mr-1" />
              -5.2%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="payout">Payouts</SelectItem>
                <SelectItem value="refund">Refunds</SelectItem>
                <SelectItem value="commission">Commissions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>{payment.seller}</TableCell>
                  <TableCell className="font-semibold">
                    ${payment.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{payment.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        payment.status === "completed" ? "default" :
                        payment.status === "failed" ? "destructive" : "secondary"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;

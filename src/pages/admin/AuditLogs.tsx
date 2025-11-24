import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Calendar } from "lucide-react";
import { toast } from "sonner";

interface AuditLog {
  id: string;
  user: string;
  action: string;
  category: "user" | "product" | "order" | "payment" | "system";
  details: string;
  ipAddress: string;
  timestamp: string;
}

const AuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([
    {
      id: "LOG001",
      user: "Alice Johnson",
      action: "Updated seller status",
      category: "user",
      details: "Changed seller S001 status to active",
      ipAddress: "192.168.1.100",
      timestamp: "2024-11-15 10:30:00"
    },
    {
      id: "LOG002",
      user: "Bob Smith",
      action: "Approved product",
      category: "product",
      details: "Approved product P001 - Wireless Headphones",
      ipAddress: "192.168.1.101",
      timestamp: "2024-11-15 09:15:00"
    },
    {
      id: "LOG003",
      user: "Carol White",
      action: "Updated order status",
      category: "order",
      details: "Changed order ORD001 status to delivered",
      ipAddress: "192.168.1.102",
      timestamp: "2024-11-15 08:45:00"
    },
    {
      id: "LOG004",
      user: "David Brown",
      action: "Processed payment",
      category: "payment",
      details: "Completed payout PAY001 for $2,500",
      ipAddress: "192.168.1.103",
      timestamp: "2024-11-14 16:20:00"
    },
    {
      id: "LOG005",
      user: "System",
      action: "Automated backup",
      category: "system",
      details: "Database backup completed successfully",
      ipAddress: "127.0.0.1",
      timestamp: "2024-11-15 00:00:00"
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const handleExport = () => {
    toast.success("Audit logs exported successfully");
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || log.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categoryColors: Record<string, string> = {
    user: "bg-blue",
    product: "bg-green-600",
    order: "bg-orange",
    payment: "bg-purple-600",
    system: "bg-gray-600"
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Audit Logs</h2>
          <p className="text-muted-foreground">Track all system activities and changes</p>
        </div>
        <Button onClick={handleExport} className="bg-blue hover:bg-blue-dark">
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.keys(categoryColors).map((category) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-sm capitalize">{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {logs.filter(l => l.category === category).length}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Logs</CardTitle>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="order">Order</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Log ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.id}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell>
                    <Badge className={categoryColors[log.category]}>
                      {log.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{log.details}</TableCell>
                  <TableCell className="text-muted-foreground">{log.ipAddress}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {log.timestamp}
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

export default AuditLogs;

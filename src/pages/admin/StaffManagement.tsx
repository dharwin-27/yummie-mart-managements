import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Staff {
  id: string;
  name: string;
  email: string;
  phone?: string;
  staffId?: string;
  role: "admin" | "moderator" | "support" | "finance";
  department: string;
  status: "active" | "inactive";
  joinedDate: string;
}

const StaffManagement = () => {
  const [staff, setStaff] = useState<Staff[]>([
    {
      id: "ST001",
      name: "Alice Johnson",
      email: "alice@mart.com",
      phone: "+1234567890",
      staffId: "EMP001",
      role: "admin",
      department: "Operations",
      status: "active",
      joinedDate: "2024-01-15"
    },
    {
      id: "ST002",
      name: "Bob Smith",
      email: "bob@mart.com",
      phone: "+1234567891",
      staffId: "EMP002",
      role: "moderator",
      department: "Product",
      status: "active",
      joinedDate: "2024-03-20"
    },
    {
      id: "ST003",
      name: "Carol White",
      email: "carol@mart.com",
      phone: "+1234567892",
      staffId: "EMP003",
      role: "support",
      department: "Customer Service",
      status: "active",
      joinedDate: "2024-06-10"
    },
    {
      id: "ST004",
      name: "David Brown",
      email: "david@mart.com",
      phone: "+1234567893",
      staffId: "EMP004",
      role: "finance",
      department: "Finance",
      status: "active",
      joinedDate: "2024-02-05"
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = (staffId: string) => {
    setStaff(staff.filter(s => s.id !== staffId));
    toast.success("Staff member removed");
  };

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Staff Management</h2>
          <p className="text-muted-foreground">Manage team members and permissions</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue hover:bg-blue-dark">
              <Plus className="w-4 h-4 mr-2" />
              Add Staff
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Staff Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input placeholder="Enter name" />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" placeholder="staff@mart.com" />
              </div>
              <div>
                <Label>Mobile Number</Label>
                <Input type="tel" placeholder="+1234567890" />
              </div>
              <div>
                <Label>Staff ID Number</Label>
                <Input placeholder="EMP001" />
              </div>
              <div>
                <Label>Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Department</Label>
                <Input placeholder="Enter department" />
              </div>
              <Button className="w-full bg-blue hover:bg-blue-dark">Add Staff</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange">{staff.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue">
              {staff.filter(s => s.role === "admin").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Moderators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {staff.filter(s => s.role === "moderator").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {staff.filter(s => s.role === "support").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Staff Members</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search staff..."
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
                <TableHead>Staff ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile Number</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.id}</TableCell>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.phone || "N/A"}</TableCell>
                  <TableCell>{member.staffId || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{member.role}</Badge>
                  </TableCell>
                  <TableCell>{member.department}</TableCell>
                  <TableCell>
                    <Badge variant={member.status === "active" ? "default" : "secondary"}>
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{member.joinedDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(member.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
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

export default StaffManagement;

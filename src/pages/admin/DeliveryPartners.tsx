import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Eye, MapPin } from "lucide-react";
import { toast } from "sonner";

interface DeliveryPartner {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleType: string;
  status: "active" | "inactive" | "busy";
  totalDeliveries: number;
  rating: number;
  currentLocation: string;
}

const DeliveryPartners = () => {
  const [partners, setPartners] = useState<DeliveryPartner[]>([
    {
      id: "DP001",
      name: "Michael Brown",
      email: "michael@delivery.com",
      phone: "+1234567890",
      vehicleType: "Bike",
      status: "active",
      totalDeliveries: 245,
      rating: 4.8,
      currentLocation: "Downtown"
    },
    {
      id: "DP002",
      name: "Sarah Wilson",
      email: "sarah@delivery.com",
      phone: "+1234567891",
      vehicleType: "Car",
      status: "busy",
      totalDeliveries: 189,
      rating: 4.9,
      currentLocation: "Uptown"
    },
    {
      id: "DP003",
      name: "David Lee",
      email: "david@delivery.com",
      phone: "+1234567892",
      vehicleType: "Scooter",
      status: "inactive",
      totalDeliveries: 156,
      rating: 4.6,
      currentLocation: "Midtown"
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredPartners = partners.filter(partner =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Delivery Partners</h2>
          <p className="text-muted-foreground">Manage delivery personnel</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-orange hover:bg-orange-dark">
              <Plus className="w-4 h-4 mr-2" />
              Add Partner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Delivery Partner</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Partner Name</Label>
                <Input placeholder="Enter name" />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" placeholder="partner@email.com" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input placeholder="+1234567890" />
              </div>
              <div>
                <Label>Vehicle Type</Label>
                <Input placeholder="Bike, Car, Scooter" />
              </div>
              <Button className="w-full bg-orange hover:bg-orange-dark">Add Partner</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Active Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {partners.filter(p => p.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Busy Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange">
              {partners.filter(p => p.status === "busy").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue">
              {partners.reduce((sum, p) => sum + p.totalDeliveries, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Partners</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search partners..."
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
                <TableHead>Partner ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Deliveries</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell className="font-medium">{partner.id}</TableCell>
                  <TableCell>{partner.name}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{partner.email}</div>
                      <div className="text-muted-foreground">{partner.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{partner.vehicleType}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        partner.status === "active" ? "default" :
                        partner.status === "busy" ? "secondary" : "outline"
                      }
                    >
                      {partner.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{partner.totalDeliveries}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      {partner.rating}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {partner.currentLocation}
                    </div>
                  </TableCell>
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
    </div>
  );
};

export default DeliveryPartners;

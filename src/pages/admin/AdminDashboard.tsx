import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Users, Package, ShoppingCart, Truck, UserCog, Receipt, FileText } from "lucide-react";
import SellerManagement from "./SellerManagement";
import ProductModeration from "./ProductModeration";
import OrdersPayments from "./OrdersPayments";
import DeliveryPartners from "./DeliveryPartners";
import StaffManagement from "./StaffManagement";
import Payments from "./Payments";
import AuditLogs from "./AuditLogs";

const navItems = [
  { title: "Seller Management", path: "/admin/sellers", icon: <Users className="w-4 h-4" /> },
  { title: "Product Moderation", path: "/admin/products", icon: <Package className="w-4 h-4" /> },
  { title: "Orders & Payments", path: "/admin/orders", icon: <ShoppingCart className="w-4 h-4" /> },
  { title: "Delivery Partners", path: "/admin/delivery", icon: <Truck className="w-4 h-4" /> },
  { title: "Staff Management", path: "/admin/staff", icon: <UserCog className="w-4 h-4" /> },
  { title: "Payments", path: "/admin/payments", icon: <Receipt className="w-4 h-4" /> },
  { title: "Audit Logs", path: "/admin/logs", icon: <FileText className="w-4 h-4" /> },
];

const AdminDashboard = () => {
  return (
    <DashboardLayout title="Admin Dashboard" navItems={navItems}>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/sellers" replace />} />
        <Route path="/sellers" element={<SellerManagement />} />
        <Route path="/products" element={<ProductModeration />} />
        <Route path="/orders" element={<OrdersPayments />} />
        <Route path="/delivery" element={<DeliveryPartners />} />
        <Route path="/staff" element={<StaffManagement />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/logs" element={<AuditLogs />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboard;

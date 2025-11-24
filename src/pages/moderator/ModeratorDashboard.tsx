import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Package } from "lucide-react";
import SellerProductListReview from "./SellerProductListReview";

const navItems = [
  { title: "Seller Product List Review", path: "/moderator/products", icon: <Package className="w-4 h-4" /> },
];

const ModeratorDashboard = () => {
  return (
    <DashboardLayout title="Product Moderator Dashboard" navItems={navItems}>
      <Routes>
        <Route path="/" element={<Navigate to="/moderator/products" replace />} />
        <Route path="/products" element={<SellerProductListReview />} />
      </Routes>
    </DashboardLayout>
  );
};

export default ModeratorDashboard;

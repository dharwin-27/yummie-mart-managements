import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Tag } from "lucide-react";
import OffersManagement from "./OffersManagement";

const navItems = [
  { title: "Coupon Codes", path: "/offers/coupons", icon: <Tag className="w-4 h-4" /> },
];

const OffersDashboard = () => {
  return (
    <DashboardLayout title="Offers Management" navItems={navItems}>
      <Routes>
        <Route path="/" element={<Navigate to="/offers/coupons" replace />} />
        <Route path="/coupons" element={<OffersManagement />} />
      </Routes>
    </DashboardLayout>
  );
};

export default OffersDashboard;

import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { DollarSign } from "lucide-react";
import CommissionFees from "./CommissionFees";

const navItems = [
  { title: "Commission & Fees", path: "/commission/fees", icon: <DollarSign className="w-4 h-4" /> },
];

const CommissionDashboard = () => {
  return (
    <DashboardLayout title="Commission & Fees Management" navItems={navItems}>
      <Routes>
        <Route path="/" element={<Navigate to="/commission/fees" replace />} />
        <Route path="/fees" element={<CommissionFees />} />
      </Routes>
    </DashboardLayout>
  );
};

export default CommissionDashboard;

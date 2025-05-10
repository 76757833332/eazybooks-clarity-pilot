
import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminGuard from "@/components/auth/AdminGuard";
import SubscriptionApprovals from "./SubscriptionApprovals";
import NotFound from "../NotFound";

const AdminPages: React.FC = () => {
  return (
    <AdminGuard>
      <Routes>
        <Route index element={<SubscriptionApprovals />} />
        <Route path="subscriptions" element={<SubscriptionApprovals />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AdminGuard>
  );
};

export default AdminPages;

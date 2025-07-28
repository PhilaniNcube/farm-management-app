import React from "react";
import AuthDebugger from "@/components/AuthDebugger";
import UserProfile from "@/components/UserProfile";
import FarmManagement from "@/components/FarmManagement";
import { api } from "../../../../convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import FarmsOverview from "@/components/dashboard-components/farms-overview";
import NewCropModal from "./[orgId]/crops/_components/new-crop-modal";
import DashboardClient from "./dashboard-client";

const DashboardPage = async () => {
  return (
    <div className="">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <NewCropModal />
        </div>
      </div>
      <DashboardClient />
    </div>
  );
};

export default DashboardPage;

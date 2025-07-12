import React from "react";
import AuthDebugger from "@/components/AuthDebugger";
import UserProfile from "@/components/UserProfile";
import FarmManagement from "@/components/FarmManagement";
import { api } from "../../../../convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import FarmsOverview from "@/components/dashboard-components/farms-overview";
import NewCropModal from "./[org-id]/crops/_components/new-crop-modal";

const DashboardPage = async () => {
  return (
    <div className="">
      <NewCropModal />
    </div>
  );
};

export default DashboardPage;

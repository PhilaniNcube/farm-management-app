import React from "react";
import LivestockTable from "./_components/livestock-table";

const LivestockPage = async ({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) => {
  const { orgId } = await params;

  return (
    <div className="container mx-auto py-6">
      <LivestockTable orgId={orgId} />
    </div>
  );
};

export default LivestockPage;

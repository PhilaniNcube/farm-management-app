import React from "react";
import CropsTable from "./_components/crops-table";
import NewCropModal from "./_components/new-crop-modal";

const CropsPage = async ({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) => {
  const { orgId } = await params;

  return (
    <div>
      <CropsTable orgId={orgId} />
    </div>
  );
};

export default CropsPage;

import React from "react";

const LabourPage = async ({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) => {
  const { orgId } = await params;

  return <div>LabourPage</div>;
};

export default LabourPage;

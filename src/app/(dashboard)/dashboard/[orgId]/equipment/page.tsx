import React from "react";

const EquipmentPage = async ({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) => {
  const { orgId } = await params;

  return <div>EquipmentPage</div>;
};

export default EquipmentPage;

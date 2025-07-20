import React from "react";

const CropPage = async ({
  params,
}: {
  params: Promise<{ cropId: string }>;
}) => {
  const { cropId } = await params;

  return <div>CropPage: {cropId}</div>;
};

export default CropPage;

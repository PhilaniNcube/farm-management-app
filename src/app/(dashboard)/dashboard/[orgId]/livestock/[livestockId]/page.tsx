import React from "react";

const LivestockPage = async (props: {
  params: { orgId: string; livestockId: string };
}) => {
  const { orgId, livestockId } = await props.params;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Livestock Details</h1>
      <p>Organization ID: {orgId}</p>
      <p>Livestock ID: {livestockId}</p>
      {/* Additional components or details can be added here */}
    </div>
  );
};

export default LivestockPage;

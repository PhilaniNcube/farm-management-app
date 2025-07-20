import React from "react";

const AnalyticsPage = async ({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) => {
  const { orgId } = await params;

  return <div>AnalyticsPage</div>;
};

export default AnalyticsPage;

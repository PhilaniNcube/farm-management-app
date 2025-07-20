import React from "react";

const OrganisationPage = async ({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) => {
  const { orgId } = await params;

  return <div>OrganisationPage for organization: {orgId}</div>;
};

export default OrganisationPage;

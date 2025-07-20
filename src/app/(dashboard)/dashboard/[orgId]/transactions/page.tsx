import React from "react";

const TransactionsPage = async ({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) => {
  const { orgId } = await params;

  return <div>TransactionsPage</div>;
};

export default TransactionsPage;

import React from "react";

const TasksPage = async ({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) => {
  const { orgId } = await params;

  return <div>TasksPage</div>;
};

export default TasksPage;

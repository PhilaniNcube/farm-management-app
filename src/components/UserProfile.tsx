"use client";

import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";

export default function UserProfile() {
  const { user: clerkUser } = useUser();
  const convexUser = useQuery(api.users.getCurrentUser);

  if (!clerkUser) {
    return <div>Please sign in to view your profile</div>;
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-2">User Profile</h2>
      <div className="space-y-2">
        <p>
          <strong>Clerk User:</strong> {clerkUser.fullName} (
          {clerkUser.primaryEmailAddress?.emailAddress})
        </p>
        <p>
          <strong>Convex User:</strong>{" "}
          {convexUser
            ? `${convexUser.name} (${convexUser.email})`
            : "Creating..."}
        </p>
        <p>
          <strong>User ID:</strong> {convexUser?._id}
        </p>
        <p>
          <strong>Farms:</strong> {convexUser?.farmIds.length || 0} farms
        </p>
      </div>
    </div>
  );
}

"use client";

import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";

export default function AuthDebugger() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const currentUser = useQuery(api.users.getCurrentUser);
  const debugAuth = useQuery(api.users.debugAuth);

  return (
    <div className="p-4 border rounded-lg bg-red-50">
      <h2 className="text-lg font-semibold mb-4">
        Authentication Debug Information
      </h2>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Clerk User Status</h3>
          <p>Loaded: {clerkLoaded ? "✅" : "❌"}</p>
          <p>User ID: {clerkUser?.id || "None"}</p>
          <p>Email: {clerkUser?.primaryEmailAddress?.emailAddress || "None"}</p>
          <p>Name: {clerkUser?.fullName || "None"}</p>
        </div>

        <div>
          <h3 className="font-semibold">Convex Current User</h3>
          <p>
            Status:{" "}
            {currentUser === undefined
              ? "Loading..."
              : currentUser === null
                ? "❌ Null"
                : "✅ Found"}
          </p>
          {currentUser && (
            <div>
              <p>ID: {currentUser._id}</p>
              <p>Name: {currentUser.name}</p>
              <p>Email: {currentUser.email}</p>
              <p>Clerk ID: {currentUser.clerkId}</p>
            </div>
          )}
        </div>

        <div>
          <h3 className="font-semibold">Debug Auth Info</h3>
          {debugAuth && (
            <div>
              <p>Has Identity: {debugAuth.hasIdentity ? "✅" : "❌"}</p>
              <p>Clerk ID: {debugAuth.clerkId || "None"}</p>
              <p>Email: {debugAuth.email || "None"}</p>
            </div>
          )}
        </div>

        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-blue-600">
            Raw Debug Data
          </summary>
          <pre className="text-xs mt-2 p-2 bg-gray-100 rounded overflow-auto">
            {JSON.stringify({ clerkUser, currentUser, debugAuth }, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}

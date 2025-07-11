"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function FarmDebugger() {
  const allFarms = useQuery(api.farms.getAllFarms);

  if (!allFarms) {
    return <div>Loading farms...</div>;
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h2 className="text-lg font-semibold mb-4">Farm Debug Information</h2>
      <div className="space-y-2">
        {allFarms.length === 0 ? (
          <p>No farms found</p>
        ) : (
          allFarms.map((farm) => (
            <div key={farm._id} className="p-2 border rounded bg-white">
              <p>
                <strong>Name:</strong> {farm.name}
              </p>
              <p>
                <strong>Organization ID:</strong>{" "}
                {farm.organizationId || "None"}
              </p>
              <p>
                <strong>Organization Slug:</strong> {farm.orgSlug || "None"}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(farm.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Farm ID:</strong> {farm._id}
              </p>
              <p>
                <strong>Owner ID:</strong> {farm.ownerId}
              </p>
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-blue-600">
                  Raw Data
                </summary>
                <pre className="text-xs mt-1 p-2 bg-gray-100 rounded overflow-auto">
                  {JSON.stringify(farm, null, 2)}
                </pre>
              </details>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

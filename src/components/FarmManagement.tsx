"use client";

import { useQuery } from "convex/react";
import { useOrganization, useOrganizationList, useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import { CreateOrganization } from "@clerk/nextjs";
import { useState } from "react";

export default function FarmManagement() {
  const { user } = useUser();
  const { organization } = useOrganization();
  const { userMemberships, isLoaded } = useOrganizationList();
  const farms = useQuery(api.farms.getFarmsByUser);
  const [showCreateOrg, setShowCreateOrg] = useState(false);

  if (!user) {
    return <div>Please sign in to view your farms</div>;
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Farm Management</h2>

      {/* Current Organization */}
      {organization && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <h3 className="font-semibold">Current Organization</h3>
          <p>{organization.name}</p>
          <p className="text-sm text-gray-600">ID: {organization.id}</p>
        </div>
      )}

      {/* Organizations List */}
      {isLoaded && userMemberships.data && userMemberships.data.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Your Organizations</h3>
          <div className="space-y-2">
            {userMemberships.data.map((orgMembership: any) => (
              <div
                key={orgMembership.organization.id}
                className="p-2 border rounded"
              >
                <p className="font-medium">{orgMembership.organization.name}</p>
                <p className="text-sm text-gray-600">
                  Role: {orgMembership.membership.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Farms List */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Your Farms</h3>
        {farms && farms.length > 0 ? (
          <div className="space-y-2">
            {farms.map((farm) => (
              <div key={farm._id} className="p-3 border rounded-lg">
                <h4 className="font-medium">{farm.name}</h4>
                <p className="text-sm text-gray-600">
                  Location: {farm.location}
                </p>
                <p className="text-sm text-gray-600">Size: {farm.size} acres</p>
                {farm.organizationId && (
                  <div className="text-sm text-blue-600">
                    <p>Organization Farm</p>
                    {farm.orgSlug && (
                      <p className="text-xs">Slug: {farm.orgSlug}</p>
                    )}
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  Created: {new Date(farm.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            No farms yet. Create an organization to get started!
          </p>
        )}
      </div>

      {/* Create Organization Button */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowCreateOrg(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          Create Organization (Farm)
        </button>
      </div>

      {/* Create Organization Modal */}
      {showCreateOrg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Create New Farm Organization
              </h3>
              <button
                onClick={() => setShowCreateOrg(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <CreateOrganization
              afterCreateOrganizationUrl="/dashboard"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-0",
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
